import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { Headers } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) { }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(
    @Headers() headers,
  ) {
    return this.favoritesService.findAll(headers);
  }

  @UseGuards(JwtAuthGuard)
  @Get('check-favorites')
  checkFavorites(
    @Headers() headers,
  ) {
    return this.favoritesService.checkFavorites(headers);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('add')
  addFavorites(
    @Headers() headers,
    @Body() updateFavoriteDto: UpdateFavoriteDto
  ) {
    return this.favoritesService.addFavorites(headers, updateFavoriteDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('remove/:id')
  remove(
    @Param('id') id: string,
    @Headers() headers) {
    return this.favoritesService.removeFavorites(+id, headers);
  }
}