import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PrenatalService } from './prenatal.service';
import { PrenatalController } from './prenatal.controller';

import { Prenatal } from './entities/prenatal.entity';
import { Gestacao } from '../gestacao/entities/gestacao.entity';
import { Agenda } from '../agenda/entities/agenda.entity';
import { Consulta } from '../consulta/entities/consulta.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Prenatal,
      Gestacao,
      Agenda,
      Consulta,
    ]),
  ],
  controllers: [PrenatalController],
  providers: [PrenatalService],
})
export class PrenatalModule {}