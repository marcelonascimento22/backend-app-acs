import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateZonaDto {

  @IsOptional()
  @IsString()
  nome?: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsOptional()
  @IsNumber()
  acsId?: number;

  @IsOptional()
  geometria?: any;

}