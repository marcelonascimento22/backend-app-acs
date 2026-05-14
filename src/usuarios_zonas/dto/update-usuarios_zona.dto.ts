import { PartialType } from '@nestjs/mapped-types';
import { CreateUsuariosZonaDto } from './create-usuarios_zona.dto';

export class UpdateUsuariosZonaDto extends PartialType(CreateUsuariosZonaDto) {}
