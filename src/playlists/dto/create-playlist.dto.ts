import { IsJSON, IsString } from "class-validator";

export class CreatePlaylistDto {

    @IsString()
    name: string;

    @IsJSON()
    contents_id: any;

    @IsString()
    user_id: number;
}
