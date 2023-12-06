import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { Favorite } from './entities/favorite.entity';
import { JsonContains, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private readonly favoriteRepository: Repository<Favorite>,
    private readonly jwtService: JwtService
  ) { }

  async create(user_id: number) {
    const date = new Date()

    try {
      const favorite = this.favoriteRepository.create({
        contents: null,
        user_id: user_id,
        created_at: date,
        updated_at: date
      })
      await this.favoriteRepository.insert(favorite)

      return favorite;
    } catch (err) {
      console.log(err)
    }
  }

  async findAll(headers: any) {
    try {
      const token = JSON.stringify(this.jwtService.decode(headers.authorization.split(" ")[1]));
      const user_id = JSON.parse(token)._id;

      const favorite = await this.favoriteRepository.findOne({
        where: {
          user_id
        }
      })

      favorite.contents = JSON.parse(favorite.contents)
      return favorite;
    } catch (err) {
      console.log(err)
      throw new HttpException("Error to get favotires", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async checkFavorites(headers: any) {
    try {
      const token = JSON.stringify(this.jwtService.decode(headers.authorization.split(" ")[1]));
      const user_id = JSON.parse(token)._id;

      const favorite = await this.favoriteRepository.findOne({
        where: {
          user_id
        }
      })

      const contents = JSON.parse(favorite.contents)
      favorite.contents = contents ? contents.map(item => item.id) : []

      return favorite;
    } catch (err) {
      console.log(err)
      throw new HttpException("Error to get favotires", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async getFavorites(headers: any) {
    try {
      const token = JSON.stringify(this.jwtService.decode(headers.authorization.split(" ")[1]));
      const user_id = JSON.parse(token)._id;

      const favorite = await this.favoriteRepository.findOne({
        where: {
          user_id
        }
      })

      return favorite;
    } catch (err) {
      console.log(err)
      throw new HttpException("Error to get favotires", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async addFavorites(headers: any, updateFavoriteDto: UpdateFavoriteDto) {
    try {
      const favotires = await this.getFavorites(headers)

      if (!favotires.contents) {
        favotires.contents = JSON.stringify([updateFavoriteDto.content])
      } else {
        const arrayFavorites = JSON.parse(favotires.contents)
        arrayFavorites.push(updateFavoriteDto.content)
        favotires.contents = JSON.stringify(arrayFavorites)
      }

      await this.favoriteRepository
        .createQueryBuilder()
        .update(Favorite)
        .set({
          contents: favotires.contents
        })
        .where('id = :id', { id: favotires.id })
        .execute();

      return favotires;
    } catch (err) {
      console.log(err)
      throw new HttpException("Error to add content to favorites", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async removeFavorites(id: number, headers: any) {
    try {
      const favotires = await this.getFavorites(headers)
      const arrayFavorites = JSON.parse(favotires.contents)

      const result = arrayFavorites.filter((item) => {
        return +item.id !== id;
      })

      await this.favoriteRepository
        .createQueryBuilder()
        .update(Favorite)
        .set({
          contents: JSON.stringify(result)
        })
        .where('id = :id', { id: favotires.id })
        .execute();

      return result;
    } catch (err) {
      console.log(err)
      throw new HttpException("Error to add content to favorites", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}