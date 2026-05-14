import { IsString, IsOptional, Length } from 'class-validator';

export class CreateComorbidadeDto {
  @IsString()
  @Length(2, 150)
  nome: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsOptional()
  @IsString()
  cid?: string;
}