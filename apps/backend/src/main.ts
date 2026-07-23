import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend clients (Angular: 4200, Vue: 5173/5174/etc.)
  app.enableCors();

  // Enable global validation pipe with automatic data scrubbing (whitelist) and DTO instantiation (transform)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Configure OpenAPI / Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('CodeLens AI Platform API')
    .setDescription(
      'Enterprise-grade AI-powered code inspection, automated code review, and developer governance REST API',
    )
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT access token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT ?? 4000;
  await app.listen(port);
  console.log(
    `CodeLens backend application running on: http://localhost:${port}`,
  );
  console.log(
    `Swagger OpenAPI Documentation available at: http://localhost:${port}/api/docs`,
  );
}
void bootstrap();
