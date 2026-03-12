import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TmdbModule } from './tmdb/tmdb.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TmdbModule,
    UsersModule,
    PrismaModule,
    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
