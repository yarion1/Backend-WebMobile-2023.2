import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Headers } from '@nestjs/common';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('')
  findByEmail(
    @Headers() headers,) {
    return this.usersService.findUserById(headers);
  }

  @UseGuards(JwtAuthGuard)
  @Put('')
  update(
    @Headers() headers,
    @Param('id') id: string, @Body() updateUserDto: UpdateUserDto
  ) {
    return this.usersService.update(headers, updateUserDto);
  }
}