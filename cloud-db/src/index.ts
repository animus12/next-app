import { AppDataSource } from './data-source';

async function bootstrap() {
  try {
    await AppDataSource.initialize();
    console.log('✅ Database connected');

    // dito ka mag start ng:
    // express server
    // cron jobs
    // socket
  } catch (error) {
    console.error('❌ DB connection error:', error);
  }
}

bootstrap();
