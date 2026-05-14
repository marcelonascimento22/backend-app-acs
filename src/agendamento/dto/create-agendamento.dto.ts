import { IsInt, IsOptional, IsString, Length, IsEnum, IsDateString } from 'class-validator';

export class CreateAgendamentoDto {
  @IsInt()
  pessoaId: number; // ✅ obrigatório

  @IsInt()
  slotId: number; // ✅ obrigatório

  @IsDateString()
  data: string; // ✅ obrigatório e validado (YYYY-MM-DD)

  @IsOptional()
  status?: string;

  @IsOptional()
  @IsString()
  @Length(0, 500)
  observacao?: string;

}