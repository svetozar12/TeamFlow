/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { GraphqlExceptionFilter } from './app/filter/gqlException.filter';
import { JWTGqlGuard } from '@apps/TeamFlowApi/src/app/guards/jwt.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const port = process.env.PORT || 3000;
  app.enableCors();
  const reflector = app.get(Reflector);
  // guards
  app.useGlobalGuards(new JWTGqlGuard(reflector));
  // filters
  app.useGlobalFilters(new GraphqlExceptionFilter());
  // pipes
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/graphql in ${
      process.env.NODE_ENV || 'development'
    }`
  );
}

bootstrap();
