import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { GestacaoService } from './gestacao.service';
import { CreateGestacaoDto } from './dto/create-gestacao.dto';
import { UpdateGestacaoDto } from './dto/update-gestacao.dto';

@Controller('gestacao')
export class GestacaoController {
  constructor(private readonly gestacaoService: GestacaoService) {}

  @Post()
  create(@Body() createGestacaoDto: CreateGestacaoDto) {
    return this.gestacaoService.create(createGestacaoDto);
  }

  @Get()
  findAll() {
    return this.gestacaoService.findAll();
  }
  
  @Get('pessoa/:pessoaId')
  findByPessoa(
    @Param('pessoaId', ParseIntPipe) pessoaId: number
  ){
    return this.gestacaoService.findByPessoa(pessoaId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gestacaoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGestacaoDto: UpdateGestacaoDto) {
    return this.gestacaoService.update(+id, updateGestacaoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gestacaoService.remove(+id);
  }
}
