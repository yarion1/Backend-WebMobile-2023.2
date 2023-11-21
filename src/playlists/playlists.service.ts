import { Injectable } from '@nestjs/common';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Playlist } from './entities/playlist.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class PlaylistsService {
  constructor(
    @InjectRepository(Playlist)
    private readonly playlistRepository: Repository<Playlist>,
    private readonly jwtService: JwtService,
  ) { }

  async create(createPlaylistDto: CreatePlaylistDto, headers: any) {
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
      throw new Error("Erro to create playlist")
    }
  }

  async findAll() {
    try {
      const data = await this.playlistRepository.find()
      return data;
    } catch {
      throw new Error("Error to list playlists")
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} playlist`;
  }

  update(id: number, updatePlaylistDto: UpdatePlaylistDto) {
    return `This action updates a #${id} playlist`;
  }

  remove(id: number) {
    return `This action removes a #${id} playlist`;
  }
}
