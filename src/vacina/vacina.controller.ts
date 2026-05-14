import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe
} from '@nestjs/common';

import { VacinaService } from './vacina.service';
import { CreateVacinaDto } from './dto/create-vacina.dto';
import { UpdateVacinaDto } from './dto/update-vacina.dto';

@Controller('vacina')
export class VacinaController {

  constructor(private readonly vacinaService: VacinaService) {}

  // ✅ CREATE
  @Post()
  create(@Body() createDto: CreateVacinaDto) {
    return this.vacinaService.create(createDto);
  }

  // ✅ LISTAR TODAS
  @Get()
  findAll() {
    return this.vacinaService.findAll();
  }

  // ✅ BUSCAR POR ID
  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.vacinaService.findOne(id);
  }

  // ✅ UPDATE
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateVacinaDto
  ) {
    return this.vacinaService.update(id, updateDto);
  }

  // ✅ DELETE
  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.vacinaService.remove(id);
  }
}