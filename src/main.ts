import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { kafkaConfig } from './config/kafka-config';
import { config } from 'dotenv';
import { MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  config();
  const app = await NestFactory.create(AppModule);
  const kafkaMicroservice = app.connectMicroservice<MicroserviceOptions>({
    ...kafkaConfig,
  });
  await app.startAllMicroservices();
  await app.listen(process.env.SERVER_PORT);
}

bootstrap();
