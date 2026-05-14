import { IsInt, Min } from 'class-validator';

export class CreateUsuariosZonaDto {

  @IsInt()
  @Min(1)
  usuarioId: number;

  @IsInt()
  @Min(1)
  zonaId: number;
}