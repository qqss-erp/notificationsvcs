import { config } from 'dotenv';

config();
export const KAFKA_TOPIC = process.env.KAFKA_CODE_TOPIC;
export const KAFKA_CLIENT_ID = process.env.KAFKA_CLIENT_ID;
export const KAFKA_BROKER_LIST = process.env.KAFKA_BROKER_LIST;
export const KAFKA_CONSUMER_ID = process.env.KAFKA_CONSUMER_ID;
export const KAFKA_USER_NAME = process.env.KAFKA_USER_NAME;
export const KAFKA_USER_PASSWORD = process.env.KAFKA_USER_PASSWORD;
