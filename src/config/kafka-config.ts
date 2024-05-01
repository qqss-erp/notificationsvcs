import { KafkaOptions, Transport } from '@nestjs/microservices';
import {
  KAFKA_BROKER_LIST,
  KAFKA_CLIENT_ID,
  KAFKA_CONSUMER_ID,
  KAFKA_USER_NAME,
  KAFKA_USER_PASSWORD,
} from './app-constants';

// FOR localhost connection comment out sasl

export const kafkaConfig: KafkaOptions = {
  transport: Transport.KAFKA,
  options: {
    client: {
      clientId: KAFKA_CLIENT_ID,
      brokers: [KAFKA_BROKER_LIST],
      sasl: {
        mechanism: 'scram-sha-256',
        username: KAFKA_USER_NAME,
        password: KAFKA_USER_PASSWORD,
      },
    },
    consumer: {
      groupId: KAFKA_CONSUMER_ID,
    },
  },
};
