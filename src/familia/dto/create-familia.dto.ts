import { IsString, IsNumber, IsOptional, IsNotEmpty, isInt, IsInt } from 'class-validator';

export class CreateFamiliaDto {
  @IsString()
  @IsNotEmpty()
  endereco: string;

  @IsString()
  @IsOptional()
  descricao?: string;

  @IsString()
  @IsOptional()
  numero?: string;

  @IsString()
  @IsOptional()
  bairro?: string;

  @IsString()
  @IsOptional()
  cep?: string;
 
  @IsInt()
  @IsOptional()
  acsId?: number;

  @IsNumber()
  @IsOptional()
  latitude?: number;

  @IsNumber()
  @IsOptional()
  longitude?: number;
}