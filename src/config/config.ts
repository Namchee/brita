import { config as loadConfig, DotenvConfigOutput } from 'dotenv';

if (process.env.NODE_ENV === 'development') {
  const config: DotenvConfigOutput = loadConfig();

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
   * Port number for the server to listen from
   */
  port: Number(process.env.PORT) || 3000,
  /**
   * Database URL connection string
   */
  dbUrl: process.env.DB_URL || '',
};
