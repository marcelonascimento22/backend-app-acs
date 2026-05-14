import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export enum TipoAgenda {
  PRENATAL = 'prenatal',
  VACINA = 'vacina',
  VISITA_DOMICILIAR = 'visita_domiciliar',
  ROTINA = 'rotina',
}

export enum StatusAgenda {
  PENDENTE = 'pendente',
  REALIZADO = 'realizado',
  ATRASADO = 'atrasado',
  CANCELADO = 'cancelado',
}

export enum PrioridadeAgenda {
  BAIXA = 'baixa',
  NORMAL = 'normal',
  ALTA = 'alta',
}

export class CreateAgendaDto {


  @IsDateString()
  dataPrevista?: string | Date;

  @IsOptional()
  @IsInt()
  profissionalId?: number;

  @IsOptional()
  @IsInt()
  quantidadeAtendimentos?: number;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Hora início deve estar no formato HH:mm',
  })
  horaInicio?: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Hora fim deve estar no formato HH:mm',
  })
  horaFim?: string;

  @IsOptional()
  @IsString()
  observacoes?: string;

  @IsOptional()
  @IsBoolean()
  ativo?: boolean;

  @IsOptional()
  createAt?: Date;

}