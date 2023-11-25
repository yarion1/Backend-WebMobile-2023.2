import { IsJSON, IsOptional, IsString } from "class-validator";

export class CreatePlaylistDto {

    @IsString()
    name: string;

    @IsJSON()
    contents: any;

    @IsString()
    @IsOptional()
    user_id: number;

    @IsString()
    type: string;
}
