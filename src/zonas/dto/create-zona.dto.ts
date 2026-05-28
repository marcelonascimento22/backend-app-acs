import { IsString, IsOptional, IsNumber, IsObject } from 'class-validator';

export class CreateZonaDto {

  @IsString()
  nome: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsObject()
  geometria: object;

}