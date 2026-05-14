import { Controller, Post, Body } from '@nestjs/common';
import { GeocodeService } from './geocode.service';

@Controller('geocode')
export class GeocodeController {
  constructor(private readonly geocodeService: GeocodeService) {}

  @Post()
  async geocode(@Body('endereco') endereco: string) {
    return this.geocodeService.buscarCoordenadas(endereco);
  }
}