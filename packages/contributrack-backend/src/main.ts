import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('ContribuTrack')
    .setDescription('ContribuTrack API')
    .setVersion('1.0')
    .build();

  const documentFactory = () =>
    SwaggerModule.createDocument(app, swaggerConfig);

  const PORT = process.env.PORT ?? 3000;

  SwaggerModule.setup('api-docs', app, documentFactory);

  console.log(`🚀 Server ready at port ${PORT}`);

  await app.listen(PORT, '0.0.0.0');
}

// eslint-disable-next-line
bootstrap();
