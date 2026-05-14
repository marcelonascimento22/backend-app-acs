import { IsEnum, IsOptional } from 'class-validator';
import { PerfilUsuario } from '../entities/perfil-usuario.enum';

export class FilterUsuarioDto {
  @IsOptional()
  @IsEnum(PerfilUsuario)
  perfil?: PerfilUsuario;
}