import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsuariosZonasService } from './usuarios_zonas.service';
import { UsuariosZonasController } from './usuarios_zonas.controller';

import { UsuariosZona } from './entities/usuarios_zona.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { Zona } from '../zonas/entities/zona.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsuariosZona, Usuario, Zona]),
  ],
  controllers: [UsuariosZonasController],
  providers: [UsuariosZonasService],
  exports: [UsuariosZonasService],
})
export class UsuariosZonasModule {}