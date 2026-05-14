import { TypeOrmModule } from '@nestjs/typeorm';
import { Comorbidade } from './entities/comorbidade.entity';
import { Module } from '@nestjs/common';
import { ComorbidadeService } from './comorbidade.service';
import { ComorbidadeController } from './comorbidade.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Comorbidade])],
  controllers: [ComorbidadeController],
  providers: [ComorbidadeService],
  exports: [TypeOrmModule],
})
export class ComorbidadeModule {}