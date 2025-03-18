import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  console.log(`🚀 Server ready at port ${process.env.PORT ?? 3000}`);
  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}

bootstrap();
