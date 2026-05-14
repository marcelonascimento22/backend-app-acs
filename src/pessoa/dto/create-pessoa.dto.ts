import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePessoaDto {

  @IsString()
  nome: string;

  @IsOptional()
  @IsString()
  cpf?: string;

  @IsOptional()
  @IsString()
  sus?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dataNascimento?: Date;

  @IsOptional()
  @IsString()
  sexo?: string;

  @IsOptional()
  @IsString()
  telefone?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  familiaId?: number;
}