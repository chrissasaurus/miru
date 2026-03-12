import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() userData: any) {
    return this.usersService.create(userData);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findById(@Param('id') id: string) {
    return this.usersService.findById(parseInt(id));
  }

  @Get('email/:email')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('email') email: string) {
    return this.usersService.findOne(email);
  }
}
