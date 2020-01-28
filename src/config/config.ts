import { config as loadConfig, DotenvConfigOutput } from 'dotenv';
import { resolve } from 'path';

if (process.env.NODE_ENV !== 'production') {
  const config: DotenvConfigOutput = loadConfig({
    path: resolve(
      process.cwd(), process.env.NODE_ENV === 'test' ? 'test.env' : '.env',
    ),
  });

  if (config.error) {
    throw new Error('Cannot load environment variables');
  }
}

/**
 * Useful environment variables which is (typically) used
 * in the application
 */
export default {
  /**
   * Database URL connection string
   */
  dbUrl: process.env.DB_URL || '',
  dsn: process.env.DSN || '',
  expirationTime: process.env.EXPIRATION_TIME || (1000 * 3 * 60), // 3 menit
};
