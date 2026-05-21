import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalGuards(app.get(JwtAuthGuard));

  app.enableCors({
    origin: [
      'http://localhost:5173',
      'https://frontend-app-acs.vercel.app'
    ],
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const port = process.env.PORT || 3000;

  await app.listen(port);
  ////console.log(`API rodando: ${await app.getUrl()}`);

  console.log(`Rodando na porta ${port}`);
}

bootstrap();