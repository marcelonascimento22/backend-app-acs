import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PessoaComorbidadeService } from './pessoa-comorbidade.service';
import { CreatePessoaComorbidadeDto } from './dto/create-pessoa-comorbidade.dto';
import { UpdatePessoaComorbidadeDto } from './dto/update-pessoa-comorbidade.dto';

@Controller('pessoa-comorbidade')
export class PessoaComorbidadeController {
  constructor(
    private readonly pessoaComorbidadeService: PessoaComorbidadeService,
  ) {}

  // 🔹 CRUD padrão
  @Post()
  create(@Body() dto: CreatePessoaComorbidadeDto) {
    return this.pessoaComorbidadeService.create(dto);
  }

  @Get()
  findAll() {
    return this.pessoaComorbidadeService.findAll();
  }

  @Get('id/:id') // 👈 evita conflito
  findOne(@Param('id') id: string) {
    return this.pessoaComorbidadeService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdatePessoaComorbidadeDto,
  ) {
    return this.pessoaComorbidadeService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pessoaComorbidadeService.remove(+id);
  }

  // VÍNCULO (rota principal do sistema)

  @Post('vincular')
  vincular(@Body() dto: CreatePessoaComorbidadeDto) {
    return this.pessoaComorbidadeService.vincular(dto);
  }

  // 🔥 LISTAR COMORBIDADES DA PESSOA
  @Get('pessoa/:pessoaId')
  listarPorPessoa(@Param('pessoaId') pessoaId: string) {
    return this.pessoaComorbidadeService.listarPorPessoa(+pessoaId);
  }
}