import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Playlist } from './entities/playlist.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ApiServiceService } from 'src/api-service/api-service.service';

@Injectable()
export class PlaylistsService {
  constructor(
    @InjectRepository(Playlist)
    private readonly playlistRepository: Repository<Playlist>,
    private readonly jwtService: JwtService,
    private readonly apiServiceService: ApiServiceService,
  ) { }

  async findPlayLists(headers: any) {

    const token = JSON.stringify(this.jwtService.decode(headers.authorization.split(" ")[1]));
    const id_user = JSON.parse(token)._id;
    try {
      const data = await this.playlistRepository.find({
        where: {
          user_id: id_user
        }
      })

      return data
    } catch (err) {
      throw new HttpException("Error to create playlists", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async create(createPlaylistDto: CreatePlaylistDto, headers: any) {

    if (createPlaylistDto.contents_id.length > 10) {
      throw new HttpException('Length max for playlist = 10', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    const token = JSON.stringify(this.jwtService.decode(headers.authorization.split(" ")[1]));
    const id_user = JSON.parse(token)._id;
    const date = new Date()

    try {
      const playlist = this.playlistRepository.create({
        ...createPlaylistDto,
        contents_id: JSON.stringify(createPlaylistDto.contents_id),
        created_at: date,
        updated_at: date,
        user_id: id_user
      })
      await this.playlistRepository.insert(playlist)

      return playlist;
    } catch (err) {
      console.log(err)
      throw new HttpException("Error to create playlists", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }


  async findById(id: number) {
    try {

      let data;
      data = await this.playlistRepository.findOne({
        where: {
          id
        }
      })

      const ids_contents = JSON.parse(data.contents_id)
      const contents = [];

      await Promise.all(ids_contents.map(async (item: number, index: number) => {
        const url = data.type === 'movies' ? `https://api.themoviedb.org/3/movie/${item}` : `https://api.themoviedb.org/3/tv/${item}`;

        const content = await this.apiServiceService.getHttpResponse(url);
        contents.push(content);
      }));

      data.contents = contents;
      return data;
    } catch {
      throw new HttpException("Erro to list playlist", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(id: number, updatePlaylistDto: UpdatePlaylistDto) {
    try {
      return await this.playlistRepository
        .createQueryBuilder()
        .update(Playlist)
        .set({
          contents_id: JSON.stringify(updatePlaylistDto.contents_id)
        })
        .where('id = :id', { id: id })
        .execute();
    } catch {
      throw new HttpException("Error to update playlist", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} playlist`;
  }
}
