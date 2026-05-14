import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { VacinacaoService } from './vacinacao.service';
import { VacinacaoController } from './vacinacao.controller';
import { Vacinacao } from './entities/vacinacao.entity';
import { Pessoa } from '../pessoa/entities/pessoa.entity';
import { Vacina } from '../vacina/entities/vacina.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vacinacao, Pessoa, Vacina])
  ],
  controllers: [VacinacaoController],
  providers: [VacinacaoService],
})
export class VacinacaoModule {}