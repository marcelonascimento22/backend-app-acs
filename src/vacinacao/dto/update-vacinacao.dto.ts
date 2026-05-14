import { IsOptional, IsNumber, IsString, IsDateString } from 'class-validator';

export class UpdateVacinacaoDto {

  @IsOptional()
  @IsNumber()
  pessoaId?: number;

  @IsOptional()
  @IsNumber()
  vacinaId?: number;

  @IsOptional()
  @IsDateString()
  dataAplicacao?: string;

  @IsOptional()
  @IsString()
  dose?: string;

  @IsOptional()
  @IsString()
  lote?: string;
}