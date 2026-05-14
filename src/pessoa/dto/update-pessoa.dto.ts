import { IsOptional, IsString } from 'class-validator';

export class UpdatePessoaDto {
  @IsOptional()
  @IsString()
  nome?: string;

  @IsOptional()
  @IsString()
  cpf?: string;

  @IsOptional()
  @IsString()
  sus?: string;

  @IsOptional()
  @IsString()
  sexo?: string;

  @IsOptional()
  @IsString()
  telefone?: string;

  @IsOptional()
  dataNascimento?: string;

  @IsOptional()
  familiaId?: number;
}