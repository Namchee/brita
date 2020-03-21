import { config as loadConfig, DotenvConfigOutput } from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
  const config: DotenvConfigOutput = loadConfig();

  if (config.error && process.env.NODE_ENV === 'development') {
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
  dbUrl: process.env.DATABASE_URL || '',
  /**
   * Sentry.io DSN for identification purposes
   */
  dsn: process.env.DSN || '',
  /**
   * Google's OAuth2 API token ID
   */
  oauthToken: process.env.OAUTH_TOKEN || '',
};
