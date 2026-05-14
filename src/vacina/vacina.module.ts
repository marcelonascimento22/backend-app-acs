import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Vacina } from './entities/vacina.entity';
import { VacinaService } from './vacina.service';
import { VacinaController } from './vacina.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vacina])
  ],
  controllers: [VacinaController],
  providers: [VacinaService],
  exports: [VacinaService], //importante se outro módulo usar
})
export class VacinaModule {}