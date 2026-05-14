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

import { PrenatalService } from './prenatal.service';
import { CreatePrenatalDto } from './dto/create-prenatal.dto';

@Controller('prenatal')
export class PrenatalController {
  constructor(private readonly prenatalService: PrenatalService) {}

  // ✅ Criar pré-natal vinculado à gestação
  @Post(':gestacaoId')
  create(
    @Param('gestacaoId', ParseIntPipe) gestacaoId: number,
    @Body() dto: CreatePrenatalDto,
  ) {
    return this.prenatalService.create(gestacaoId, dto);
  }

  // 📋 Listar pré-natais por gestação
  @Get('gestacao/:gestacaoId')
  findByGestacao(
    @Param('gestacaoId', ParseIntPipe) gestacaoId: number,
  ) {
    return this.prenatalService.findByGestacao(gestacaoId);
  }

  // 🔍 Buscar um pré-natal
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.prenatalService.findOne(id);
  }

  // ✏️ Atualizar
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Partial<CreatePrenatalDto>,
  ) {
    return this.prenatalService.update(id, dto);
  }

  // ❌ Remover
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.prenatalService.remove(id);
  }
}