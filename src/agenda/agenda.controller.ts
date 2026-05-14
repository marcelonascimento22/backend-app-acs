import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';

import { AgendaService } from './agenda.service';
import { CreateAgendaDto } from './dto/create-agenda.dto';
import { UpdateAgendaDto } from './dto/update-agenda.dto';

@Controller('agenda')
export class AgendaController {
  constructor(private readonly agendaService: AgendaService) {}

  // ✅ Criar agendamento
  @Post()
  create(@Body() dto: CreateAgendaDto) {
    return this.agendaService.create(dto);
  }

  // 📋 Listar todos
  @Get()
  findAll() {
    return this.agendaService.findAll();
  }

  // 📋 Listar por pessoa
  @Get('pessoa/:pessoaId')
  findByPessoa(
    @Param('pessoaId', ParseIntPipe) pessoaId: number,
  ) {
    return this.agendaService.findByPessoa(pessoaId);
  }

  @Get('dias-disponiveis')
  getDiasDisponiveis() {
    return this.agendaService.getDiasDisponiveis();
  }

  // 🔍 Buscar um
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.agendaService.findOne(id);
  }

  // ✏️ Atualizar
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAgendaDto,
  ) {
    return this.agendaService.update(id, dto);
  }

  @Patch(':id/cancelar')
  async cancelamentoAgenda(
    @Param('id') id: string,
    @Body('obs') obs: string,
  ) {
    await this.agendaService.cancelamentoAgenda(Number(id), obs);

    return {
      message: 'Agenda cancelada com sucesso',
    };
  }

  // 🔥 Realizar atendimento (vira consulta)
  @Post(':id/realizar')
  realizar(@Param('id', ParseIntPipe) id: number) {
    return this.agendaService.realizarAtendimento(id);
  }

  // ❌ Remover
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.agendaService.remove(id);
  }
  
}