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
   * Application port
   *
   * This variable will be used by the app to listen specific events
   * sent to this port number
   */
  port: process.env.PORT || 3000,
  /**
   * Database URL connection string
   */
  dbUrl: process.env.DB_URL || '',
  /**
   * Redis server connection string
   */
  redisUrl: process.env.REDIS_URL || '',
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
  /**
   * State lifetime
   */
  expirationTime: Number(process.env.EXPIRATION_TIME) || 1000 * 60 * 3,
};
