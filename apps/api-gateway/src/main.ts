/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app/app.module';
import { GrpcProblemDetailsExceptionFilter } from '@clarte/shared-nest/filters';
import cookieParser from 'cookie-parser';
import { env } from 'process';

async function bootstrap() {
  const globalPrefix = 'api';
  const swaggerEnabled = env.SWAGGER_ENABLED === 'true';
  const swaggerPrefix = 'docs';
  const app = await NestFactory.create(AppModule);
  if (swaggerEnabled) {
    const { SwaggerModule, DocumentBuilder } = await import('@nestjs/swagger');
    const config = new DocumentBuilder()
      .setTitle('Clarte API Gateway')
      .setDescription('Gateway for microservices')
      .setVersion('1.0')
      .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(swaggerPrefix, app, documentFactory);
  }

  const port = process.env.PORT || 3000;
  app.setGlobalPrefix(globalPrefix);
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  app.useGlobalFilters(new GrpcProblemDetailsExceptionFilter());

  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
  if (swaggerEnabled)
    Logger.log(`🚀 Swagger is running on: http://localhost:${port}/${swaggerPrefix}`);
  Logger.log('Protocol: HTTP');
  Logger.log('🚀 API Gateway started');
}

bootstrap();
