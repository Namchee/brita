import Router from '@koa/router';
import { lineMiddleware } from './../utils/middleware';
import { ControllerList } from './../utils/bootstrap';
import { generateAPIRoute } from './rest';

/**
 * Generate a Koa router instance with predefined controllers
 *
 * @param {ControllerList} controllers List of controllers
 * @return {Router} Koa router instance, refer to API docs for endpoints
 */
export function generateRoutes(controllers: ControllerList): Router {
  const router = new Router();
  const apiRoute = generateAPIRoute(controllers);

  // Define route for LINE webhook
  router.post(
    '/line-webhook',
    lineMiddleware,
    controllers.lineController.handleRequest,
  );
  // Define router for REST API
  router.use('/api', apiRoute.routes());
  // Special route for handling logins
  router.post(
    '/login',
    controllers.authMiddleware.authenticateUser,
    controllers.userController.login,
  );

  return router;
}
