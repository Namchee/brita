import Router from 'koa-router';
import { Context, Next } from 'koa';
import crypto from 'crypto';
import config from 'config/env';
import { ControllerList } from 'utils/bootstrap';

/**
 * Koa middleware for LINE client signature validation
 *
 * @param {Context} ctx Koa Context object, must contain 'X-Line-Signature'
 * @param {Next} next Koa next function
 * @return {Promise<any>} Execute next middleware function if signature matches
 * or respond with `401` if signature doesn't match
 */
async function lineMiddleware(ctx: Context, next: Next): Promise<any> {
  const channelSecret = config.secretToken;
  const body = JSON.stringify(ctx.body);

  const signature = crypto
    .createHmac('SHA256', channelSecret)
    .update(body).digest('base64');

  if (ctx.request.header['X-Line-Signature'] === signature) {
    return next();
  } else {
    ctx.response.status = 401;
    ctx.response.body = {
      data: null,
      error: 'Unauthorized request for bot endpoint access',
    };
  }
}

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

  return router;
}
