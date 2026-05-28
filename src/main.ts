import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /**
   * 🌐 Origens permitidas para Web
   */
  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://frontend-app-acs.vercel.app',
  ];

  /**
   * ✅ Configuração CORS
   */
  app.enableCors({
    origin: (origin, callback) => {
      console.log(`🔍 [CORS Debug] Origin recebido: "${origin}"`);

      /**
       * 📱 Permitir:
       * - Apps mobile nativos
       * - APK Android
       * - WebViews
       * - Postman / Insomnia
       * - React Native / Expo
       * - Rede local
       */
      if (
        !origin ||
        origin === 'null' ||
        (typeof origin === 'string' &&
          (
            origin.startsWith('file://') ||
            origin.startsWith('capacitor://') ||
            origin.startsWith('ionic://') ||
            origin.startsWith('exp://') ||
            origin.startsWith('http://192.168.') ||
            origin.startsWith('http://10.') ||
            origin.startsWith('http://172.') ||
            origin.startsWith('https://localhost') ||
            origin.startsWith('http://localhost')
          ))
      ) {
        console.log('✅ [CORS Debug] Permitido mobile/local.');
        return callback(null, true);
      }

      /**
       * 🌍 Permitir frontend web
       */
      if (allowedOrigins.includes(origin)) {
        console.log('✅ [CORS Debug] Permitido web.');
        return callback(null, true);
      }

      /**
       * ❌ Bloquear origem desconhecida
       */
      console.log(`❌ [CORS Debug] Bloqueado: ${origin}`);

      return callback(
        new Error(`CORS bloqueado para origem: ${origin}`),
        false,
      );
    },

    credentials: true,

    methods: [
      'GET',
      'POST',
      'PUT',
      'PATCH',
      'DELETE',
      'OPTIONS',
    ],

    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'Origin',
      'X-Requested-With',
    ],

    exposedHeaders: [
      'Authorization',
    ],

    optionsSuccessStatus: 204,
  });

  /**
   * ✅ Validação global
   */
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  /**
   * 🚀 Porta
   */
  const port = process.env.PORT || 3000;

  await app.listen(port);

  console.log(`🚀 API rodando na porta ${port}`);
}

bootstrap();