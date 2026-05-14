import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateConsultaDto {
  @IsNumber()
  @IsNotEmpty()
  pessoaId?: number;

  @IsInt()
  profissionalId: number;

  @IsDateString()
  dataConsulta?: string | Date;

  
  tipo: string;

  @IsOptional()
  status?: string;

  @IsOptional()
  @IsString()
  observacoes?: string;

  @IsInt()
  agendamentoId: number;

  @IsString()
  descricao?: string;

  @IsOptional()
  @IsString()
  diagnostico?: string;

  @IsOptional()
  @IsString()
  prescricao?: string;
}