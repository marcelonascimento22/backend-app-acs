import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConsultaService } from './consulta.service';
import { ConsultaController } from './consulta.controller';
import { Consulta } from './entities/consulta.entity';
import { Pessoa } from '../pessoa/entities/pessoa.entity';
import { Prenatal } from '../prenatal/entities/prenatal.entity';
import { Gestacao } from '../gestacao/entities/gestacao.entity';
import { Agendamento } from 'src/agendamento/entities/agendamento.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Consulta,
      Pessoa,
      Prenatal,
      Gestacao,
      Agendamento,
    ]),
  ],
  controllers: [ConsultaController],
  providers: [ConsultaService],
  exports: [ConsultaService],
})
export class ConsultaModule {}