import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsOptional,
  IsEnum,
  Matches,
} from 'class-validator';

export enum PerfilUsuario {
  ADMIN = 'ADMIN',
  ACS = 'ACS',
  ATENDIMENTO = 'ATENDIMENTO',
}

export class CreateUsuarioDto {
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  nome: string;

  @IsOptional()
  @Matches(/^\d{10,11}$/, { message: 'Telefone inválido' })
  telefone?: string;

  @IsOptional()
  @Matches(/^\d{11}$/, { message: 'CPF deve ter 11 dígitos' })
  cpf?: string;

  @IsEmail({}, { message: 'Email inválido' })
  email: string;

  @MinLength(6, { message: 'Senha deve ter no mínimo 6 caracteres' })
  senha: string;

  @IsOptional()
  @IsEnum(PerfilUsuario, { message: 'Perfil inválido' })
  perfil?: PerfilUsuario;

  @IsOptional()
  @IsEnum([true, false], { message: 'Ativo deve ser true ou false' })
  ativo?: boolean;
}