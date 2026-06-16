import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitamos CORS para que Angular pueda comunicarse con NestJS
  app.enableCors();

  // Configuración global de validaciones (DTOs)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Ignora datos extra que mande el usuario y no estén en el DTO
      forbidNonWhitelisted: true, // Tira error si mandan datos maliciosos no definidos
      transform: true, // Transforma los tipos de datos (ej: string a Date)
    }),
  );

  await app.listen(3000);
}
bootstrap();