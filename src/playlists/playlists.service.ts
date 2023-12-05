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

      const playlistsParsed = data.map(playlist => {
        return {
          ...playlist,
          contents: JSON.parse(playlist.contents)
        };
      });

      return playlistsParsed
    } catch (err) {
      console.log(err)
      throw new HttpException("Error to list playlists", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async getPlayListName(headers: any) {
    const token = JSON.stringify(this.jwtService.decode(headers.authorization.split(" ")[1]));
    const id_user = JSON.parse(token)._id;

    try {
      const data = await this.playlistRepository.find({
        where: {
          user_id: id_user
        },
        select: [
          "id",
          "name",
          "contents"
        ]
      })

      const playlistsParsed = data.map(playlist => {
        const contents = JSON.parse(playlist.contents)

        return {
          ...playlist,
          contents: contents.map(item => item.id)
        };
      });

      return playlistsParsed
    } catch (err) {
      console.log(err)
      throw new HttpException("Error to list playlists", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async create(createPlaylistDto: CreatePlaylistDto, headers: any) {

    const token = JSON.stringify(this.jwtService.decode(headers.authorization.split(" ")[1]));
    const id_user = JSON.parse(token)._id;
    const date = new Date()

    try {
      const playlist = this.playlistRepository.create({
        ...createPlaylistDto,
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

  async getPlaylist(id: number) {
    try {
      const playlist = await this.playlistRepository.findOne({
        where: {
          id
        }
      })

      return playlist;
    } catch (err) {
      console.log(err)
      throw new HttpException("Error to get playlist", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async addContent(id: number, updatePlaylistDto: UpdatePlaylistDto) {
    try {
      const playlist = await this.getPlaylist(id)

      if (!playlist.contents) {
        playlist.contents = JSON.stringify([updatePlaylistDto.contents])
      } else {
        const arrayFavorites = JSON.parse(playlist.contents)
        arrayFavorites.push(updatePlaylistDto.contents)
        playlist.contents = JSON.stringify(arrayFavorites)
      }

      await this.playlistRepository
        .createQueryBuilder()
        .update(Playlist)
        .set({
          contents: playlist.contents
        })
        .where('id = :id', { id: id })
        .execute();

      return playlist;
    } catch (err) {
      console.log(err)
      throw new HttpException("Error to add content to favorites", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }


  async removeContent(id: number, idContent: { id: number }) {
    try {
      const playlist = await this.getPlaylist(id)
      const arrayContents = JSON.parse(playlist.contents)
      playlist.contents = arrayContents.filter((item) => item.id !== idContent.id)

      await this.playlistRepository
        .createQueryBuilder()
        .update(Playlist)
        .set({
          contents: JSON.stringify(playlist.contents)
        })
        .where('id = :id', { id: id })
        .execute();

      return playlist;
    } catch (err) {
      console.log(err)
      throw new HttpException("Error to add content to favorites", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async findById(id: number) {
    try {

      const data = await this.playlistRepository.findOne({
        where: {
          id
        }
      })

      data.contents = JSON.parse(data.contents)

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
          contents: JSON.stringify(updatePlaylistDto.contents)
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
