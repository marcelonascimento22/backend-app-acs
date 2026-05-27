// test.controller.ts
import { Controller, Get } from '@nestjs/common';
import { Public } from 'src/auth/public.decorator';

@Controller('test')
export class TestController {

  @Public()
  @Get()
  teste() {
    return {
      ok: true,
      mensagem: 'API funcionando',
    };
  }
}