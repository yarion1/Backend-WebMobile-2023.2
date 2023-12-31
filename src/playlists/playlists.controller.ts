import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PlaylistsService } from './playlists.service';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Headers } from '@nestjs/common';

@Controller('playlists')
export class PlaylistsController {
  constructor(private readonly playlistsService: PlaylistsService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createPlaylistDto: CreatePlaylistDto,
    @Headers() headers,
  ) {
    return this.playlistsService.create(createPlaylistDto, headers);
  }

  @UseGuards(JwtAuthGuard)
  @Get('byId/:id')
  findOne(@Param('id') id: string) {
    return this.playlistsService.findById(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('')
  findPlayLists(
    @Headers() headers,
  ) {
    return this.playlistsService.findPlayLists(headers);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/name')
  getPlayListName(
    @Headers() headers,
  ) {
    return this.playlistsService.getPlayListName(headers);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('add/:id')
  update(@Param('id') id: string, @Body() updatePlaylistDto: UpdatePlaylistDto) {
    return this.playlistsService.addContent(+id, updatePlaylistDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('remove/:id')
  removeContent(
    @Param('id') id: string,
    @Body() idContent: {
      id: number
    }
  ) {
    return this.playlistsService.removeContent(+id, idContent);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.playlistsService.remove(+id);
  }
}
