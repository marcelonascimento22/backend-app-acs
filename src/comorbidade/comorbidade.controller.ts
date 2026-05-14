import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';

import { ComorbidadeService } from './comorbidade.service';
import { CreateComorbidadeDto } from './dto/create-comorbidade.dto';
import { UpdateComorbidadeDto } from './dto/update-comorbidade.dto';

@Controller('comorbidade')
export class ComorbidadeController {
  constructor(private readonly service: ComorbidadeService) {}

  @Post()
  create(@Body() dto: CreateComorbidadeDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(@Query('nome') nome?: string) {
    return this.service.findAll(nome);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateComorbidadeDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}