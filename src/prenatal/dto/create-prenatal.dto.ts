import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePrenatalDto {
  @IsDateString()
  dataConsulta: Date;

  @IsOptional()
  @IsNumber()
  idadeGestacional?: number;

  @IsOptional()
  @IsNumber()
  pesoGestante?: number;

  @IsOptional()
  @IsString()
  pressaoArterial?: string;

  @IsOptional()
  @IsNumber()
  alturaUterina?: number;

  @IsOptional()
  @IsNumber()
  batimentosFetais?: number;

  @IsOptional()
  @IsString()
  examesSolicitados?: string;

  @IsOptional()
  @IsString()
  observacoes?: string;
}