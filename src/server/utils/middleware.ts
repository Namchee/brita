import chalk from 'chalk';
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
export async function lineMiddleware(ctx: Context, next: Next): Promise<any> {
  const channelSecret = config.secretToken;
  const body = JSON.stringify(ctx.request.body);

  const signature = crypto
    .createHmac('SHA256', channelSecret)
    .update(body).digest('base64');

  if (ctx.request.header['x-line-signature'] === signature) {
    await next();
  } else {
    ctx.response.status = 401;
    ctx.response.body = {
      data: null,
      error: 'Unauthorized request for bot endpoint access',
    };
  }
}

/**
 * Koa middleware for HTTP request-response logging
 * @param {Context} ctx Koa context object
 * @param {Next} next Koa next function
 * @return {Promise<any>} Executes next middleware function in the pipeline
 */
export async function logger(ctx: Context, next: Next): Promise<any> {
  const startTime = process.hrtime();
  const startMs = startTime[0] * 1000 + startTime[1] / 1000000;

  await next();

  const endTime = process.hrtime();
  const endMs = endTime[0] * 1000 + endTime[1] / 1000000;

  const method = ctx.request.method;

  const url = ctx.request.path;

  const status = (status: number): string => {
    if (status >= 500) {
      return chalk.red(status) + ' ❌ ';
    } else if (status >= 400) {
      return chalk.yellow(status) + ' ⚠️ ';
    }

    return chalk.green(status) + ' ✔️ ';
  };

  /* eslint-disable-next-line */
  console.log(`${chalk.grey(new Date().toISOString())} - ${chalk.yellow(method)}: ${url} --- ${status(ctx.response.status)} - ${(endMs - startMs).toFixed(2)}ms`);
}
