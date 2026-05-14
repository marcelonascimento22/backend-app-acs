import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profissional } from './entities/profissional.entity';
import { ProfissionalService } from './profissional.service';
import { ProfissionalController } from './profissional.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Profissional])], // 👈 AQUI
  controllers: [ProfissionalController],
  providers: [ProfissionalService],
  exports: [TypeOrmModule], // 👈 importante se outro módulo usar
})
export class ProfissionalModule {}