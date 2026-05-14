import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';

import { ConsultaService } from './consulta.service';
import { CreateConsultaDto } from './dto/create-consulta.dto';

@Controller('consulta')
export class ConsultaController {
  constructor(private readonly consultaService: ConsultaService) {}

  // ✅ Criar consulta (genérica)
  @Post()
  create(@Body() dto: CreateConsultaDto) {
    return this.consultaService.create(dto);
  }

  @Post('atender')
  atender(@Body() dto: CreateConsultaDto) {
    return this.consultaService.atender(dto);
  }

  // 🔥 Criar consulta de pré-natal (fluxo completo)
  @Post('prenatal/:gestacaoId/:pessoaId')
  createPrenatal(
    @Param('gestacaoId', ParseIntPipe) gestacaoId: number,
    @Param('pessoaId', ParseIntPipe) pessoaId: number,
    @Body() dto: any, // depois podemos tipar melhor
  ) {
    return this.consultaService.criarConsultaPrenatal(
      pessoaId,
      gestacaoId,
      dto,
    );
  }

  // 📋 Listar todas
  @Get()
  findAll(@Query('tipo') tipo?: string) {
    return this.consultaService.findAll(tipo);
  }

  // 📋 Listar por pessoa
  @Get('pessoa/:pessoaId')
  findByPessoa(
    @Param('pessoaId', ParseIntPipe) pessoaId: number,
  ) {
    return this.consultaService.findByPessoa(pessoaId);
  }

  // 🔍 Buscar uma
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.consultaService.findOne(id);
  }

  // ✏️ Atualizar
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Partial<CreateConsultaDto>,
  ) {
    return this.consultaService.update(id, dto);
  }

  // ❌ Cancelar (melhor que deletar)
  @Patch(':id/cancelar')
  cancelar(@Param('id', ParseIntPipe) id: number) {
    return this.consultaService.cancelar(id);
  }

  // ❌ Deletar (se realmente quiser)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.consultaService.remove(id);
  }
}