import { Controller, Get, Post, Body, Param, ParseIntPipe, Patch, Delete } from '@nestjs/common';
import { VacinacaoService } from './vacinacao.service';
import { CreateVacinacaoDto } from './dto/create-vacinacao.dto';
import { UpdateVacinacaoDto } from './dto/update-vacinacao.dto';

@Controller('vacinacao')
export class VacinacaoController {

  constructor(
    private readonly vacinacaoService: VacinacaoService
  ) {}

  @Post()
  create(@Body() createVacinacaoDto: CreateVacinacaoDto) {
    return this.vacinacaoService.create(createVacinacaoDto);
  }

  @Get()
  findAll() {
    return this.vacinacaoService.findAll();
  }

  @Get('pessoa/:pessoaId')
  findByPessoa(
    @Param('pessoaId', ParseIntPipe) pessoaId: number
  ) {
    return this.vacinacaoService.findByPessoa(pessoaId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vacinacaoService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateVacinacaoDto
  ) {
    return this.vacinacaoService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.vacinacaoService.remove(id);
  }  

}