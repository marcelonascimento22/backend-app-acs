import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { VisitaService } from './visita.service';
import { CreateVisitaDto } from './dto/create-visita.dto';
import { UpdateVisitaDto } from './dto/update-visita.dto';

@Controller('visita')
export class VisitaController {
  constructor(private readonly visitaService: VisitaService) {}

  @Post()
  create(@Body() dto: CreateVisitaDto) {
    return this.visitaService.create(dto);
  }

  @Get()
  findAll() {
    return this.visitaService.findAll();
  }
  @Get('/minhas-visitas/:userId')
  async minhasVisitas(@Param('userId') userId: number) {
    return this.visitaService.findByUsuario(userId);
  }

  @Get('listarvisitas/:id')
  listarPrioridadeVisitas(@Param('id') id: number) {
    return this.visitaService.listarVisitas(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.visitaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVisitaDto: UpdateVisitaDto) {
    return this.visitaService.update(+id, updateVisitaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.visitaService.remove(+id);
  }
}
