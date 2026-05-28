import { IsString, IsOptional, IsNumber, IsObject } from 'class-validator';

export class CreateZonaDto {

  @IsString()
  nome: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsOptional()
  @IsNumber()
  acsId?: number;

  @IsObject()
  geometria: object;

}