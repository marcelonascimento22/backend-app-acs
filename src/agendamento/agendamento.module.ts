import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Agendamento } from './entities/agendamento.entity';
import { Slot } from '../slot/entities/slot.entity';
import { Pessoa } from '../pessoa/entities/pessoa.entity';

import { AgendamentoService } from './agendamento.service';
import { AgendamentoController } from './agendamento.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Agendamento, // 👈 obrigatório
      Slot,        // 👈 obrigatório (vc usa no service)
      Pessoa,      // 👈 obrigatório (vc usa no service)
    ]),
  ],
  controllers: [AgendamentoController],
  providers: [AgendamentoService],
})
export class AgendamentoModule {}