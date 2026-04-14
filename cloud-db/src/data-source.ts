import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Photo } from './entity/user-photo.entity';
import { dbEntities } from './database/company.db';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: '127.0.0.1',       // palitan kung remote
  port: 3306,
  username: 'mark',
  password: 'animus',
  database: 'clouddb',

  synchronize: false,      // ❌ wag sa production
  logging: false,

  entities: dbEntities,
  migrations: ['src/migration/*.ts'],
});
