import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Slot } from './entities/slot.entity';
import { Agenda } from '../agenda/entities/agenda.entity';
import { SlotService } from './slot.service';
import { SlotController } from './slot.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Slot, Agenda]), // 👈 MUITO IMPORTANTE
  ],
  controllers: [SlotController],
  providers: [SlotService],
})
export class SlotModule {}