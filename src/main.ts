import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalGuards(app.get(JwtAuthGuard));

  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://frontend-app-acs.vercel.app',
  ];

  app.enableCors({
    origin: (origin, callback) => {
      // Permite apps mobile, Postman, Insomnia (sem origin)
      if (!origin) {
        return callback(null, true);
      }

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