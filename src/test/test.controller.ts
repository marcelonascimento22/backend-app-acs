import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, Controller, Get, UseGuards, Header } from '@nestjs/common';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import request from 'supertest';

// 1. Criamos Controllers "Fake" para testar apenas a lógica do Throttler
@Controller('test')
class TestController {
  @Get('ping')
  ping() {
    return { message: 'pong' };
  }
}

@Controller('internal')
class InternalController {
  @Get('sync')
  sync() {
    return { message: 'synced' };
  }
}

describe('Throttler (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    // Definimos a chave para o teste
    process.env.INTERNAL_API_KEY = 'test-key';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        // 2. Importamos o ThrottlerModule diretamente com uma config de teste
        ThrottlerModule.forRoot([{
          ttl: 60000,
          limit: 5, // Limite baixo para o teste falhar rápido
        }]),
      ],
      controllers: [TestController, InternalController],
      providers: [
        {
          provide: APP_GUARD,
          useClass: ThrottlerGuard,
        },
      ],
    }).compile();

  /*
     NOTA: Se você usa um Custom Throttler Guard no seu projeto 
     que verifica a 'x-internal-key', você deve importá-lo aqui 
     em vez do ThrottlerGuard padrão.
  */

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    if (app) await app.close();
  });

  it('🔥 Teste 1 - deve bloquear após exceder o limite (5 requisições)', async () => {
    const url = '/test/ping';

    for (let i = 0; i < 5; i++) {
      await request(app.getHttpServer()).get(url).expect(200);
    }

    const response = await request(app.getHttpServer()).get(url);
    expect(response.status).toBe(429);
  });

  it('🔐 Teste 2 - rota interna SEM chave deve respeitar rate limit', async () => {
    const url = '/internal/sync';

    for (let i = 0; i < 5; i++) {
      await request(app.getHttpServer()).get(url).expect(200);
    }

    const response = await request(app.getHttpServer()).get(url);
    expect(response.status).toBe(429);
  });

  it('🔓 Teste 3 - rota interna COM chave deve ignorar rate limit', async () => {
    const url = '/internal/sync';

    // Se o seu Guard customizado estiver funcionando, 10 requisições devem passar
    for (let i = 0; i < 10; i++) {
      const response = await request(app.getHttpServer())
        .get(url)
        .set('x-internal-key', 'test-key');
      
      expect(response.status).toBe(200);
    }
  });

  it('🚫 Teste 4 - chave inválida deve bloquear', async () => {
    const url = '/internal/sync';

    for (let i = 0; i < 5; i++) {
      await request(app.getHttpServer())
        .get(url)
        .set('x-internal-key', 'chave-errada');
    }

    const res = await request(app.getHttpServer())
      .get(url)
      .set('x-internal-key', 'chave-errada');

    expect(res.status).toBe(429);
  });
});