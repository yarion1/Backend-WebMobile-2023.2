import { Controller, Request, Post, UseGuards, Body, Get, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) { }

  @UseGuards(LocalAuthGuard)
  @Post('/')
  async login(@Request() req) {
    return this.authService.login(req.user.email);
  }

  @Post('/register')
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return user;
  }
}
