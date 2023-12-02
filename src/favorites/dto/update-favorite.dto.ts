import { PartialType } from '@nestjs/mapped-types';
import { CreateFavoriteDto } from './create-favorite.dto';
import { IsJSON, IsOptional } from 'class-validator';

export class UpdateFavoriteDto {
    @IsJSON()
    @IsOptional()
    content: any;
}