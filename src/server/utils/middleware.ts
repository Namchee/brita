import { validateSignature } from '@line/bot-sdk';
import crypto from 'crypto';
import { Context, Next } from 'koa';
import config from './../config/env';

/**
 * Koa middleware for LINE client signature validation
 *
 * @param {Context} ctx Koa Context object, must contain 'X-Line-Signature'
 * @param {Next} next Koa next function
 * @return {Promise<any>} Execute next middleware function if signature matches
 * or respond with `401` if signature doesn't match
 */
export async function lineMiddleware(ctx: Context, next: Next): Promise<void> {
  const channelSecret = config.secretToken;
  const body = JSON.stringify(ctx.body);

  const signature = crypto
    .createHmac('SHA256', channelSecret)
    .update(body).digest('base64');

  if (validateSignature(body, channelSecret, signature)) {
    await next();
  } else {
    ctx.response.status = 401;
    ctx.response.body = {
      data: null,
      error: 'Unauthorized request for bot endpoint access',
    };
  }
}
