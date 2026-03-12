import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { User } from '../../generated/prisma/client';
import { GoogleProfile } from './interfaces/google-profile.interface';

@Injectable()
export class AuthService {
  private readonly SALT_ROUNDS = 10;

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<Omit<User, 'password'> | null> {
    const user = await this.usersService.findByEmail(email);
    
    if (!user || !user.password) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return null;
    }

    // Remove password from returned user object
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async login(user: Omit<User, 'password'>) {
    const payload = { email: user.email, sub: user.id };
    
    const access_token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: '15m',
    });
    
    const refresh_token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: '7d',
    });

    // Hash refresh token before storing
    const hashedRefreshToken = await bcrypt.hash(refresh_token, this.SALT_ROUNDS);
    
    // Store hashed refresh token in database
    await this.usersService.update(user.id, {
      refreshToken: hashedRefreshToken,
    });

    return {
      access_token,
      refresh_token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
      },
    };
  }

  async register(email: string, password: string, name?: string): Promise<Omit<User, 'password'>> {
    // Check if user already exists
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, this.SALT_ROUNDS);

    // Create user
    const newUser = await this.usersService.create({
      email,
      password: hashedPassword,
      name,
    });

    // Remove password from returned user object
    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  async logout(userId: string) {
    await this.usersService.update(userId, {
      refreshToken: null,
    });
  }

  async refreshToken(refreshToken: string) {
    try {
      // Verify the refresh token
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      // Find user by ID
      const user = await this.usersService.findById(payload.sub);
      if (!user || !user.refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Compare provided refresh token with stored hashed token
      const isTokenValid = await bcrypt.compare(refreshToken, user.refreshToken);
      if (!isTokenValid) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Generate new access token
      const newPayload = { email: user.email, sub: user.id };
      const access_token = this.jwtService.sign(newPayload, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: '15m',
      });

      return {
        access_token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
        },
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async googleLogin(profile: GoogleProfile) {
    const { id, emails, displayName, photos } = profile;
    const email = emails?.[0]?.value;
    const avatar = photos?.[0]?.value;
    const name = displayName;

    if (!email) {
      throw new UnauthorizedException('Google profile must have an email');
    }

    // Try to find user by Google ID first
    let user = await this.usersService.findByGoogleId(id);
    
    if (!user) {
      // If not found by Google ID, try by email
      user = await this.usersService.findByEmail(email);
      
      if (user) {
        // User exists with email but no Google ID - update them
        user = await this.usersService.update(user.id, {
          googleId: id,
          avatar: avatar || user.avatar,
          name: name || user.name,
        });
      } else {
        // Create new user from Google profile
        user = await this.usersService.create({
          email,
          googleId: id,
          name,
          avatar,
        });
      }
    }

    // Remove password from returned user object
    const { password: _, ...userWithoutPassword } = user;
    
    // Return login tokens
    return this.login(userWithoutPassword);
  }
}
