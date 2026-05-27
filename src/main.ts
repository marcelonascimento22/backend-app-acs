import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 💡 O Guard Global (JwtAuthGuard) foi removido daqui!
  // Agora ele deve ser declarado no `app.module.ts` para não quebrar o CORS.

  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://frontend-app-acs.vercel.app',
  ];

  app.enableCors({
    origin: (origin, callback) => {
      // 📱 Permissões especiais para o APK Mobile e ferramentas de teste:
      // - !origin: requisições nativas sem header Origin (Postman/Insomnia)
      // - origin === 'null': comum em WebViews de APKs Android compilados
      // - file://, capacitor://, ionic://: protocolos internos de apps mobile
      if (
        !origin || 
        origin === 'null' || 
        origin.startsWith('file://') || 
        origin.startsWith('capacitor://') || 
        origin.startsWith('ionic://')
      ) {
        return callback(null, true);
      }

      // 🌐 Permissões para os seus ambientes Web (Local e Vercel)
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error(`CORS bloqueado para origem: ${origin}`),
        false,
      );
    },

    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'Origin',
    ],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const port = process.env.PORT || 3000;

  await app.listen(port);

  console.log(`API rodando na porta ${port}`);
}

bootstrap();