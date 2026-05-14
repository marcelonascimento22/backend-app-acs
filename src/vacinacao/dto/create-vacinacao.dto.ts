// create-vacinacao.dto.ts
import { IsInt, IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateVacinacaoDto {
  @IsInt()
  pessoaId: number;

  @IsInt()
  vacinaId: number;

  @IsInt()
  dose?: string;

  @IsDateString()
  dataAplicacao?: string;

  @IsOptional()
  @IsString()
  lote?: string;
}