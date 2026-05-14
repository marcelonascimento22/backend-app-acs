import { Controller, Get, Post, Body, Query, Param, Delete, Put } from '@nestjs/common';
import { FamiliaService } from './familia.service';
import { CreateFamiliaDto } from './dto/create-familia.dto';
import { UpdateFamiliaDto } from './dto/update-familia.dto';

@Controller('familia')
export class FamiliaController {
  constructor(private readonly familiaService: FamiliaService) {}

  @Post()
  create(@Body() createFamiliaDto: CreateFamiliaDto) {
    return this.familiaService.create(createFamiliaDto);
  }
  
  @Get()
  async find(@Query('search') search?: string) {
    if (search) {
      return this.familiaService.searchByEndereco(search);
    }

    return this.familiaService.findAll();
  }

  @Get()
  findAll() {
    return this.familiaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.familiaService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateFamiliaDto: UpdateFamiliaDto,
  ) {
    ////console.log('Received update request for Familia ID:', id);
    ////console.log('Update data:', updateFamiliaDto);
    return this.familiaService.update(+id, updateFamiliaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.familiaService.remove(+id);
  }
}
