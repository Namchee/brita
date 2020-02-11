import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import { connectToDatabase } from './database/connection';
import { generateRoutes } from 'routes/router';
import { bootstrapApp } from 'utils/bootstrap';

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
  app.use(router.routes());

  return app;
}
