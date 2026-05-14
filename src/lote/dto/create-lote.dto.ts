// create-lote.dto.ts
import { IsInt, IsString, IsDateString } from 'class-validator';

export class CreateLoteDto {
  @IsString()
  codigo: string;

  @IsDateString()
  validade: string;

  @IsInt()
  quantidade: number;

  @IsInt()
  vacinaId: number;
}