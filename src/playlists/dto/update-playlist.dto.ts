import { PartialType } from '@nestjs/mapped-types';
import { CreatePlaylistDto } from './create-playlist.dto';
import { IsJSON } from 'class-validator';

export class UpdatePlaylistDto {
    @IsJSON()
    contents: any;
}
