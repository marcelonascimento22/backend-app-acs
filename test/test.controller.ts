// test.controller.ts
import { Controller, Get } from '@nestjs/common';

@Controller('test')
export class TestController {
  @Get('ping')
  ping() {
    return { ok: true };
  }
}