import { IsJSON, IsOptional, IsString } from "class-validator";

export class CreateFavoriteDto {
    
    @IsJSON()
    @IsOptional()
    contents: any;

    @IsString()
    @IsOptional()
    user_id: number;
}