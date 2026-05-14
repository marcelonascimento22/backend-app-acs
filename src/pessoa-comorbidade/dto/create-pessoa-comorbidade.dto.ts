import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePessoaComorbidadeDto {
  @IsNumber()
  pessoaId: number;

  @IsNumber()
  comorbidadeId: number;

  @IsOptional()
  dataDiagnostico?: string;

  @IsOptional()
  @IsString()
  observacao?: string;

  @IsOptional()
  @IsString()
  status?: string;
}