import Koa, { Context } from 'koa';
import bodyParser from 'koa-bodyparser';
import compress from 'koa-compress';
import { init, captureException } from '@sentry/node';
import { connectToDatabase } from './database/connection';
import { generateRoutes } from './routes/router';
import { bootstrapApp } from './utils/bootstrap';
import config from './config/env';

/**
 * Error handling middleware for Koa
 *
 * @param {Error} err Error object
 * @param {Context} ctx Koa context object
 */
function errorHandler(err: Error, ctx: Context): void {
  ctx.response.status = 500;
  ctx.response.body = {
    data: null,
    error: 'Internal Server Error',
  };

  if (process.env.NODE_ENV === 'development') {
    const chalk = require('chalk');
    console.error(chalk.redBright(err.stack));
  } else {
    captureException(err);
  }
}

/**
 * Creates a new Koa application
 *
 * Technically, app-as-function is silly IMO.
 * But, exporting `Promise` is easier with functions
 *
 * @return {Promise<Koa>} A new Koa application with predefined routes
 */
export async function createApp(): Promise<Koa> {
  const conn = await connectToDatabase();

  const router = generateRoutes(bootstrapApp(conn));

  const app = new Koa();

  app.use(bodyParser());
  app.use(compress());

  if (process.env.NODE_ENV === 'production') {
    init({ dsn: config.dsn });
  } else {
    const logger = require('./utils/middleware').logger;
    app.use(logger);
  }

  app.use(router.routes()).use(router.allowedMethods());
  app.on('error', errorHandler);

  return app;
}
