import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AgendamentoService } from './agendamento.service';
import { CreateAgendamentoDto } from './dto/create-agendamento.dto';
import { UpdateAgendamentoDto } from './dto/update-agendamento.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateConsultaDto } from '../consulta/dto/create-consulta.dto';

@Controller('agendamentos')
export class AgendamentoController {
  constructor(
    private readonly service: AgendamentoService,
  ) {}

  @Post()
  create(@Body() dto: CreateAgendamentoDto) {
    return this.service.create(dto);
  }

  // 🔹 LISTAR TODOS
  @Get()
  findAll() {
    return this.service.findAll();
  }

  // 🔹 FILTRAR POR DATA (SEM AUTH)
  @Get('por-data')
  findByDate(@Query('data') data: string) {
    return this.service.findByDate(data);
  }

  // 🔹 FILTRAR POR DATA + USUÁRIO (COM AUTH)
  @UseGuards(JwtAuthGuard)
  @Get('minha-agenda')
  listarPorDataEUsuario(
    @Query('data') data: string,
    @Req() req: any,
  ) {
    const userId = req.user.id;
    return this.service.buscarPorDataEUsuario(data, userId);
  }

  // 🔹 POR PESSOA
  @Get('pessoa/:pessoaId')
  findByPessoa(@Param('pessoaId') pessoaId: string) {
    return this.service.findByPessoa(+pessoaId);
  }

  // 🔹 DATAS COM AGENDAMENTO
  @Get('datas')
  datasComAgendamento() {
    return this.service.datasComAgendamento();
  }

  // 🔹 BUSCAR POR ID
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAgendamentoDto) {
    return this.service.update(+id, dto);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: string
  ) {
    return this.service.updateStatus(+id, status);
  }

  @Patch(':id/cancelar')
  cancelar(@Param('id') id: string) {
    return this.service.cancelarAgendamento(Number(id));
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}