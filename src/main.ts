import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import {config as localConfig} from "../config/config";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    allowedHeaders: ['content-type'],
    origin: localConfig.corsOrigin,
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
  app.use(cookieParser(localConfig.COOKIE_SECRET));
  await app.listen(localConfig.PORT || 3001);
}

bootstrap();
