import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ParseIntPipe,
  Query,
} from '@nestjs/common';

import { PessoaService } from './pessoa.service';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { UpdatePessoaDto } from './dto/update-pessoa.dto';

@Controller('pessoa')
export class PessoaController {
  constructor(private readonly pessoaService: PessoaService) {}

  // ✅ CREATE
  @Post()
  create(@Body() createPessoaDto: CreatePessoaDto) {
    //console.log('CONTROLLER:', createPessoaDto);
    return this.pessoaService.create(createPessoaDto);
  }

  // ✅ GET COM SEARCH (UNIFICADO)
  @Get()
  async find(@Query('search') search?: string) {
    if (search) {
      return this.pessoaService.searchByPessoa(search);
    }

    return this.pessoaService.findAll();
  }

  @Get('vacinacao-status')
  buscarPorStatusVacina(
    @Query('vacinaId') vacinaId: number,
    @Query('status') status: 'tomou' | 'nao_tomou',
  ) {
    return this.pessoaService.buscarPorStatusVacina(vacinaId, status);
  } 

  // ✅ GET BY ID
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.pessoaService.findOne(id);
  }

  // ✅ UPDATE
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePessoaDto: UpdatePessoaDto,
  ) {
    return this.pessoaService.update(id, updatePessoaDto);
  }

  // ✅ DELETE
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.pessoaService.remove(id);
  }
}