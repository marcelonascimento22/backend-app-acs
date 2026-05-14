import { IsBoolean, IsInt, IsString, Matches, Min } from 'class-validator';

export class CreateSlotDto {
  @IsInt()
  agendaId?: number;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Horário deve estar no formato HH:mm',
  })
  horario?: string;

  @IsInt()
  @Min(1)
  capacidade?: number;

  @IsInt()
  ocupados?: number;

  @ IsBoolean()
  status?: boolean;
}