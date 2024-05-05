import { NestFactory, Reflector } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { AccesTokenGuard } from './common/guards';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Intensa-Chat')
    .setDescription('Chat API for Intensa-Chat-App')
    .setVersion('1.0')
    .addTag('Intensa-Chat')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('/api/v1/');

  app.use(cookieParser());

  await app.listen(4200);
}
bootstrap();
