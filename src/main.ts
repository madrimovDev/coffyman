import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { config } from 'dotenv';

config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix('api/v1');

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Coffyman API')
    .setDescription('Coffee shop management system API documentation')
    .setVersion('1.0')
    .addBearerAuth({
      name: 'JWT',
      type: 'http',
      bearerFormat: 'Bearer',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);

  const customOptions = {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'Coffyman API Docs',
  };

  SwaggerModule.setup('api/docs', app, document, customOptions);

  const port = 3000;
  await app.listen(+port);
  return port;
}

bootstrap().then((port) => {
  Logger.log('Server is running on host: http://localhost:' + port);
  Logger.log(
    'Swagger documentation is available at: http://localhost:' +
      port +
      '/api/docs',
  );
});
