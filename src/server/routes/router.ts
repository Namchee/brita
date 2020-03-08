import Router from '@koa/router';
import { lineMiddleware } from './../utils/middleware';
import { ControllerList } from './../utils/bootstrap';

/**
 * Generate a Koa router instance with predefined controllers
 *
 * @param {ControllerList} controllers List of controllers
 * @return {Router} Koa router instance, refer to API docs for endpoints
 */
export function generateRoutes(controllers: ControllerList): Router {
  const router = new Router();

  // Define route for LINE webhook
  router.post(
    '/line-webhook',
    lineMiddleware,
    controllers.lineController.handleRequest,
  );

  return router;
}
