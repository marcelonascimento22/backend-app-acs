import { Controller, Get, Inject, Param } from "@nestjs/common";
import { AgendaService } from "src/agenda/agenda.service";
import { DisponibilidadeService } from "./disponibilidade.service";

@Controller('disponibilidade')
export class DisponibilidadeController {
  constructor(
    private readonly disponibilidadeService: DisponibilidadeService,
  ) {}

  @Get()
  async listar() {
    const agendas = await this.disponibilidadeService.buscar();
    return agendas.flatMap((agenda) => agenda.slots);
  }

  @Get(':data')
  async getPorData(@Param('data') data: string) {
    return this.disponibilidadeService.buscarPorData(data);
  }
}