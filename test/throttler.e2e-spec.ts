import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import request from 'supertest';
// Importamos os seus componentes REAIS para garantir que o teste seja fiel ao seu código
import { CustomThrottlerGuard } from '../src/common/custom-throttler.guard';
import { InternalController } from '../src/internal/internal.controller';
import { TestController } from '../test/test.controller';

describe('Throttler (e2e) - Acs App Map', () => {
  let app: INestApplication;

  beforeAll(async () => {
    // 1. Configuramos a variável de ambiente que o seu CustomThrottlerGuard deve ler
    process.env.INTERNAL_API_KEY = 'minha-chave-secreta-de-teste';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        // 2. Subimos apenas o ThrottlerModule com uma config curta para o teste
        ThrottlerModule.forRoot([{
          ttl: 60000,
          limit: 2, // Limite de apenas 2 para o teste falhar na 3ª
        }]),
      ],
      controllers: [InternalController, TestController],
      providers: [
        {
          provide: APP_GUARD,
          useClass: CustomThrottlerGuard, // Usamos o seu Guard real aqui!
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('✅ Deve permitir requisições dentro do limite', async () => {
    await request(app.getHttpServer()).get('/test/ping').expect(200);
    await request(app.getHttpServer()).get('/test/ping').expect(200);
  });

  it('🚫 Deve bloquear a 3ª requisição (Rate Limit Ativo)', async () => {
    // Como o limite é 2, a terceira deve retornar 429
    const response = await request(app.getHttpServer()).get('/test/ping');
    expect(response.status).toBe(429);
  });

  it('🔑 Deve IGNORAR o limite quando enviar a x-internal-key correta', async () => {
    // Fazemos 5 requisições seguidas (estourando o limite de 2)
    for (let i = 0; i < 5; i++) {
      await request(app.getHttpServer())
        .get('/internal/sync')
        .set('x-internal-key', 'minha-chave-secreta-de-teste')
        .expect(200); // Todas devem retornar 200/201
    }
  });

  it('⚠️ Deve BLOQUEAR se a chave interna enviada estiver errada', async () => {
    // Simulando tentativa de bypass com chave errada
    await request(app.getHttpServer())
      .get('/internal/sync')
      .set('x-internal-key', 'chave-invalida')
      .expect(200);

    await request(app.getHttpServer())
      .get('/internal/sync')
      .set('x-internal-key', 'chave-invalida')
      .expect(200);

    const res = await request(app.getHttpServer())
      .get('/internal/sync')
      .set('x-internal-key', 'chave-invalida');
      
    expect(res.status).toBe(429);
  });
});