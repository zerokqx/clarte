/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app/app.module';
import { GrpcProblemDetailsExceptionFilter } from '@clarte/shared-nest/filters';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Clarte API Gateway')
    .setDescription('Gateway for microservices')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);

  const globalPrefix = 'api';
  const swaggerPrefix = 'docs';
  SwaggerModule.setup(swaggerPrefix, app, documentFactory);
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3000;
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  app.useGlobalFilters(new GrpcProblemDetailsExceptionFilter());

  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
  );
  Logger.log(
    `🚀 Swagger is running on: http://localhost:${port}/${swaggerPrefix}`,
  );
  Logger.log('Protocol: HTTP');
  Logger.log('🚀 API Gateway started');
}

bootstrap();
