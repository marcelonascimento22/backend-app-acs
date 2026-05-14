export class CreateGestacaoDto {

  dataUltimaMenstruacao: Date;

  dataPrevistaParto?: Date;

  altoRisco?: boolean;

  observacoes?: string;

  pessoaId: number;

}