import { IsInt, IsDateString, IsOptional, IsString, IsBoolean, IsNotEmpty } from 'class-validator';

export class CreateVisitaDto {

  @IsDateString()
  @IsNotEmpty()
  dataVisita: string;

  @IsString()
  @IsNotEmpty()
  tipoVisita: string;

  @IsString()
  @IsOptional() // Permite que o campo não seja enviado ou seja null
  situacaoFamilia?: string | null;

  @IsBoolean()
  @IsOptional()
  encaminhamento?: boolean;

  @IsString()
  @IsOptional()
  observacoes?: string | null;

  @IsInt()
  @IsNotEmpty()
  pessoaId?: number;

  // Estes campos aparecem no seu banco de dados (imagem anterior).
  // Se o seu backend for preenchê-los automaticamente (ex: via Token/Session), 
  // deixe como @IsOptional para não dar erro no envio do formulário.
  @IsInt()
  @IsOptional()
  acsId?: number;

  @IsInt()
  @IsOptional()
  familiaId?: number;
}