import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ZonasService } from './zonas.service';
import { CreateZonaDto } from './dto/create-zona.dto';

@Controller('zonas')
export class ZonasController {

  constructor(private readonly zonasService: ZonasService) {}

  @Get()
  findAll() {
    return this.zonasService.findAll();
  }

  @Post()
  create(@Body() createZonaDto: CreateZonaDto) {
    return this.zonasService.create(createZonaDto);
  }

  // atualizar nome, descrição, acs e geometria
  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() body: any,
  ) {

    const { nome, descricao, acsId, geometria } = body;

    return this.zonasService.update(id, {
      nome,
      descricao,
      acsId,
      geometria,
    });

  }

  // atualizar somente geometria
  @Put(':id/geometria')
  updateGeometria(
    @Param('id') id: number,
    @Body('geometria') geometria: any,
  ) {
    return this.zonasService.updateGeometria(id, geometria);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.zonasService.remove(id);
  }

}