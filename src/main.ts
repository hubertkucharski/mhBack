import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.enableCors({
    allowedHeaders: ['content-type'],
    origin: configService.get('CORS_URL'),
    credentials: true,
  });

  const config = new DocumentBuilder()
      .setTitle('MegaK')
      .setDescription(
          '',
      )
      .setVersion('1.0.0')
      .addTag('')
      .addCookieAuth('jwt')
      .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api2', app, document);

  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser(configService.get('COOKIE_SECRET')));
  await app.listen(configService.get('PORT') || 3001);
}

bootstrap();
