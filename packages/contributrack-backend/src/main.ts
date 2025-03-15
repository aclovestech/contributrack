import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log(`🚀 Server ready at port ${process.env.PORT ?? 3000}`);
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}

// eslint-disable-next-line
bootstrap();
