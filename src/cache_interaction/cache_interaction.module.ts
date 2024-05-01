import { Module } from '@nestjs/common';
import { RedisController } from './redis/redis.controller';
import { RedisService } from './redis/redis.service';
import { ClientsModule } from '@nestjs/microservices';
import { kafkaConfig } from '../config/kafka-config';
import { DcacheModule, ResponseEntity } from '@qqss-erp/dmex-rcache-npm';

@Module({
  imports: [
    DcacheModule,
    ClientsModule.register([
      {
        name: 'DMEX_MSG_SERVICE',
        ...kafkaConfig,
      },
    ]),
  ],
  controllers: [RedisController],
  providers: [RedisService, ResponseEntity],
})
export class CacheInteractionModule {}
