import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { kafkaConfig } from './config/kafka-config';
import { ClientsModule } from '@nestjs/microservices';
import { ConfigModule } from '@nestjs/config';
import { DcacheModule } from '@qqss-erp/dmex-rcache-npm';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { HealthModule } from './health/health.module';
import {
  AuthModule,
  AuthorizationGuard,
  AuthorizationModule,
  JwtAuthGuard,
} from '@qqss-erp/dmex-auth-npm';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule,
    ClientsModule.register([
      {
        name: 'DMEX_MSG_SERVICE',
        ...kafkaConfig,
      },
    ]),
    DcacheModule,
    HealthModule,
    AuthModule,
    AuthorizationModule,
    CacheModule.register({
      store: redisStore, //TODO having issues upgrade to latest redis-store 3.0.1. Fix me.
      host: process.env.REDIS_HOST, //default host
      port: process.env.REDIS_PORT, //default port
      ttl: Number(process.env.REDIS_TTL),
      isGlobal: true,
      auth_pass: process.env.AUTH_PASS,
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AuthorizationGuard,
    },
  ],
  exports: [DcacheModule],
})
export class AppModule {}
