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
}