import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('ContribuTrack')
    .setDescription('ContribuTrack API')
    .setVersion('1.0')
    .build();

  const documentFactory = () =>
    SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('api', app, documentFactory);

  console.log(`🚀 Server ready at port ${process.env.PORT ?? 3000}`);

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}

// eslint-disable-next-line
bootstrap();
