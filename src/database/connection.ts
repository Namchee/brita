import { createConnection, Connection } from 'typeorm';
import config from './../config/config';

export function connectToDatabase(): Promise<Connection> {
  return createConnection({
    type: 'postgres',
    url: config.dbUrl,
    entities: ['./src/database/model/*.ts'],
  });
}
