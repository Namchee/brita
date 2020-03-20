import chalk from 'chalk';
import { Context, Next } from 'koa';
import config from './../config/env';
import { OAuth2Client } from 'google-auth-library';
import { UserRepository } from '../repository/user';
import { BritaTokenPayload } from '../services/user';
import { UserError } from './error';

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

/**
 * Authentication middleware class for handling authenticated requests
 */
export class AuthenticationMiddleware {
  public constructor(
    private readonly oauthClient: OAuth2Client,
    private readonly repository: UserRepository,
  ) { }

  public authenticateUser = async (ctx: Context, next: Next): Promise<void> => {
    if (!ctx.request.headers['authorization']) {
      ctx.response.body = null;
      ctx.response.status = 401;

      return;
    }

    const authHeader = ctx.request.headers['authorization'].split(' ');

    if (authHeader.length !== 2 || authHeader[0] !== 'Bearer') {
      ctx.response.body = null;
      ctx.response.status = 400;

      return;
    }

    try {
      const payload = await this.decodeToken(authHeader[1]);

      if (!await this.isUserVerified(payload)) {
        ctx.response.body = null;
        ctx.response.status = 401;

        return;
      }

      Object.assign(ctx, { auth: payload });

      return await next();
    } catch (err) {
      if (err instanceof UserError) {
        ctx.response.body = {
          data: null,
          error: err.message,
        };
        ctx.response.status = 400;

        return;
      }

      ctx.app.emit('error', err, ctx);
    }
  }

  private isUserVerified = async (
    payload: BritaTokenPayload,
  ): Promise<boolean> => {
    const administrator = await this.repository.findByEmail(payload.email);

    return !!administrator;
  }

  private decodeToken = async (token: string): Promise<BritaTokenPayload> => {
    try {
      const validation = await this.oauthClient.verifyIdToken({
        idToken: token,
        audience: config.oauthToken,
      });

      const payload = validation.getPayload();

      if (!payload ||
        !payload.email ||
        !payload.email_verified ||
        !payload.name
      ) {
        throw new UserError('Invalid OAuth2 token');
      }

      return payload as BritaTokenPayload;
    } catch (err) {
      throw new UserError('Invalid OAuth2 token');
    }
  }
}
