import Router from '@koa/router';
import { lineMiddleware } from './../utils/middleware';
import { ControllerList } from './../utils/bootstrap';
import { Context, Next } from 'koa';

const ganteng = ['hai', 'sayang', 'ku'];

/**
 * Generate a Koa router instance with predefined controllers
 *
 * @param {ControllerList} controllers List of controllers
 * @return {Router} Koa router instance, refer to API docs for endpoints
 */
export function generateRoutes(controllers: ControllerList): Router {
  const router = new Router();

  router.post(
    '/line-webhook',
    lineMiddleware,
    controllers.lineController.handleRequest,
  );

  router.post('/', async (ctx: Context, next: Next) => {
    ctx.response.body = {
      data: ganteng[Math.floor(Math.random() * ganteng.length)],
    };
  });

  return router;
}
