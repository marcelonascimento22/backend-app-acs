import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LoteService } from './lote.service';
import { CreateLoteDto } from './dto/create-lote.dto';
import { UpdateLoteDto } from './dto/update-lote.dto';


@Controller('lote')
export class LoteController {
  constructor(private readonly loteService: LoteService) {}

  @Post()
  create(@Body() createLoteDto: CreateLoteDto) {
    return this.loteService.create(createLoteDto);
  }

  @Get()
  findAll() {
    return this.loteService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.loteService.findOne(+id);
  }

  @Get('vacina/:id')
  findByVacina(@Param('id') id: string) {
    return this.loteService.findByVacina(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateLoteDto) {
    return this.loteService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.loteService.remove(+id);
  }
}