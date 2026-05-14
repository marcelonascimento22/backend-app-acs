// src/internal/internal.controller.ts
import { Controller, Get } from '@nestjs/common';
import { Internal } from '../common/decorators/internal.decorator';

@Controller('internal')
export class InternalController {

  @Internal()
  @Get('sync')
  sync() {
    return { ok: true };
  }
}