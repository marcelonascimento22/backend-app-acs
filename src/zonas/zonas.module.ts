import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Zona } from './entities/zona.entity';
import { ZonasService } from './zonas.service';
import { ZonasController } from './zonas.controller';
import { UsuariosZona } from 'src/usuarios_zonas/entities/usuarios_zona.entity';

@Module({
imports: [
    // ADICIONE AQUI: O ZonasModule precisa registrar o UsuariosZona para o ZonasService poder usá-lo
    TypeOrmModule.forFeature([Zona, UsuariosZona]), 
  ],
  controllers: [ZonasController],
  providers: [ZonasService],
  exports: [ZonasService],
})
export class ZonasModule {} 