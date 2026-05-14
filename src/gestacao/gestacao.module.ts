import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gestacao } from './entities/gestacao.entity';
import { GestacaoController } from './gestacao.controller';
import { GestacaoService } from './gestacao.service';
import { Pessoa } from '../pessoa/entities/pessoa.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Gestacao, Pessoa])
  ],
  controllers: [GestacaoController],
  providers: [GestacaoService],
  exports: [GestacaoService],
})
export class GestacaoModule {}