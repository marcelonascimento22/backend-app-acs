import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VisitaService } from './visita.service';
import { VisitaController } from './visita.controller';
import { Visita } from './entities/visita.entity';
import { Pessoa } from '../pessoa/entities/pessoa.entity';
import { Familia } from '../familia/entities/familia.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Visita, Pessoa, Familia, Usuario])],
  controllers: [VisitaController],
  providers: [VisitaService],
})
export class VisitaModule {}
