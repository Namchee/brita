import Router from '@koa/router';
import { ControllerList } from '../utils/bootstrap';

/**
 * Utility function to generate REST API v1 routes
 *
 * @param {ControllerList} controllers List of predefined controllers
 * @return {Router} Sub-router for REST API v1 routes
 */
function generateV1APIRoute(controllers: ControllerList): Router {
  const v1Router = new Router();

  const categoryController = controllers.categoryController;

  v1Router.get('/categories', categoryController.findAll);
  v1Router.get('/categories/:name', categoryController.findByName);
  v1Router.post('/categories', categoryController.create);
  v1Router.delete('/categories/:id', categoryController.delete);
  v1Router.patch('/categories/:id', categoryController.update);

  const announcementController = controllers.announcementController;

  v1Router.get('/announcements', announcementController.find);
  v1Router.post('/announcements', announcementController.create);
  v1Router.delete('/announcements/:id', announcementController.delete);
  v1Router.patch('/announcements/:id', announcementController.update);

  return v1Router;
}

/**
 * Generate a router for handling REST API endpoints
 *
 * @param {ControllerList} controllers List of predefined controllers
 * @return {Router} Sub-router for REST API routes
 */
export function generateAPIRoute(controllers: ControllerList): Router {
  const apiRouter = new Router();

  const v1Router = generateV1APIRoute(controllers);

  apiRouter.use('/v1', v1Router.routes());

  return apiRouter;
}
