import { Body, Controller, Inject, Logger, Post, Req } from '@nestjs/common';
import { RedisService } from './redis.service';
import { ClientKafka } from '@nestjs/microservices';
import { KAFKA_TOPIC } from '../../config/app-constants';
import { ClearCacheRequest } from '../clear_cache_request';
import { ResponseEntity } from '@qqss-erp/dmex-rcache-npm';

@Controller('cache')
export class RedisController {
  private readonly logger = new Logger(RedisController.name);
  private readonly kafkaQueue = KAFKA_TOPIC;
  constructor(
    private readonly service: RedisService,
    private response: ResponseEntity<ClearCacheRequest>,
    @Inject('DMEX_MSG_SERVICE') private kafkaClient: ClientKafka,
  ) {}

  @Post('/clear')
  async clearCache(@Body() body: ClearCacheRequest, @Req() req) {
    try {
      this.logger.debug('Sending message to queue');
      this.logger.debug(req?.user?.tenant); // TODO check optional
      this.logger.log(body);

      this.kafkaClient.emit(this.kafkaQueue, {
        key: 'keyName',
        value: body.payload,
        headers: {
          subject: body.subject,
          action: body.action,
        },
      });
      return this.response.successResponse('Cache cleared');
      //return 'good';
    } catch (e) {
      this.logger.error(e);
      return this.response.errorResponse(
        'Error clearing cache. Please verify the redis key' + e,
      );
      //return 'bad';
    }
  }
}
