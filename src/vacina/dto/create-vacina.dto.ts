import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsDateString,
  IsEnum
} from 'class-validator';
import { ViaAdministracao } from '../entities/viaAdministracao.enum';

export class CreateVacinaDto {

  @IsString()
  nome?: string;

  @IsOptional()
  @IsString()
  codigo?: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsOptional()
  @IsString()
  fabricante?: string;

  // ⚠️ (você decidiu manter)
  @IsOptional()
  @IsString()
  lote?: string;

  // ✅ validade como string ISO (melhor prática em DTO)
  @IsOptional()
  @IsDateString()
  validade?: string;

  @IsOptional()
  @IsString()
  doseRecomendada?: string;

  @IsOptional()
  @IsEnum(ViaAdministracao)
  viaAdministracao?: ViaAdministracao;
   
  @IsOptional()
  @IsString()
  grupoAlvo?: string;

  @IsOptional()
  @IsNumber()
  intervaloDoses?: number;

  @IsOptional()
  @IsBoolean()
  ativa?: boolean;
}