import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoteService } from './lote.service';
import { LoteController } from './lote.controller';
import { Vacina } from '../vacina/entities/vacina.entity';
import { Lote } from './entities/lote.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Lote, Vacina])],
  controllers: [LoteController],
  providers: [LoteService],
})
export class LoteModule {}
