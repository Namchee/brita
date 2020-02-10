import { config as loadConfig, DotenvConfigOutput } from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
  const config: DotenvConfigOutput = loadConfig();

  if (config.error) {
    throw new Error('Cannot load environment variables');
  }
}

/**
 * Useful environment variables which is (typically) used
 * by the application
 */
export default {
  /**
   * Database URL connection string
   */
  dbUrl: process.env.DB_URL || '',
  /**
   * Sentry.io DSN for identification purposes
   */
  dsn: process.env.DSN || '',
  /**
   * LINE Channel access token
   */
  accessToken: process.env.CHANNEL_ACCESS_TOKEN || '',
  /**
   * LINE channel secret token
   */
  secretToken: process.env.SECRET_TOKEN || '',
};
