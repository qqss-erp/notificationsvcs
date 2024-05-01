import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
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
import { CacheInteractionModule } from './cache_interaction/cache_interaction.module';

@Module({
  imports: [
    ConfigModule,
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
    CacheInteractionModule,
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
