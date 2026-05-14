import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SlotService } from './slot.service';
import { CreateSlotDto } from './dto/create-slot.dto';
import { UpdateSlotDto } from './dto/update-slot.dto';

@Controller('slots')
export class SlotController {
  constructor(private readonly service: SlotService) {}

  @Post()
  create(@Body() dto: CreateSlotDto) {
    return this.service.create(dto);
  }

  @Get('agenda/:agendaId')
  findByAgenda(@Param('agendaId') agendaId: string) {
    return this.service.findByAgenda(+agendaId);
  }

  @Patch(':id/ocupar')
  ocupar(@Param('id') id: number) {
    return this.service.ocupar(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSlotDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}