import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DisponibilidadeService } from './disponibilidade.service';
import { DisponibilidadeController } from './disponibilidade.controller';
import { Agenda } from '../agenda/entities/agenda.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Agenda]), // 🔥 ISSO AQUI resolve tudo
  ],
  controllers: [DisponibilidadeController],
  providers: [DisponibilidadeService],
})
export class DisponibilidadeModule {}