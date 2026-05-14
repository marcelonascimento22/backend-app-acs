import {
  IsOptional,
  IsString,
  IsDateString,
} from 'class-validator';

export class UpdatePessoaComorbidadeDto {
  @IsOptional()
  @IsDateString()
  dataDiagnostico?: string;

  @IsOptional()
  @IsString()
  observacao?: string;

  @IsOptional()
  @IsString()
  status?: string;
}