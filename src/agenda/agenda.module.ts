import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Agenda } from './entities/agenda.entity';
import { Profissional } from '../profissional/entities/profissional.entity';

import { AgendaService } from './agenda.service';
import { AgendaController } from './agenda.controller';
import { Slot } from 'src/slot/entities/slot.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Agenda, Profissional, Slot]),
  ],
  controllers: [AgendaController],
  providers: [AgendaService],
  exports: [AgendaService, TypeOrmModule], // 👈 ESSENCIAL
})
export class AgendaModule {}
