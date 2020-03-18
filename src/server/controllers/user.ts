import {
  BritaTokenPayload, UserService,
} from '../services/user';
import { Context } from 'koa';
import { UserError } from '../utils/error';

export class UserController {
  public constructor(
    private readonly userService: UserService,
  ) { }

  public find = async (ctx: Context): Promise<void> => {
    try {
      const result = await this.userService.find();

      ctx.response.status = 200;
      ctx.response.body = {
        data: result,
        error: null,
      };
    } catch (err) {
      if (err instanceof UserError) {
        ctx.response.status = 400;
        ctx.response.body = {
          data: null,
          error: err.message,
        };

        return;
      }

      ctx.app.emit('error', err, ctx);
    }
  }

  public create = async (ctx: Context): Promise<void> => {
    try {
      const payload = (ctx.request as any).auth as BritaTokenPayload;

      const result = await this.userService.create(
        ctx.request.body,
        payload,
      );

      ctx.response.status = 201;
      ctx.response.body = {
        data: result,
        error: null,
      };
    } catch (err) {
      if (err instanceof UserError) {
        ctx.response.status = 400;
        ctx.response.body = {
          data: null,
          error: err.message,
        };

        return;
      }

      ctx.app.emit('error', err, ctx);
    }
  }

  public delete = async (ctx: Context): Promise<void> => {
    try {
      const payload = (ctx.request as any).auth as BritaTokenPayload;

      const result = await this.userService.delete(
        ctx.params.id,
        payload,
      );

      ctx.response.status = result ? 204 : 404;
      ctx.response.body = {
        data: result,
        error: null,
      };
    } catch (err) {
      if (err instanceof UserError) {
        ctx.response.status = 400;
        ctx.response.body = {
          data: null,
          error: err.message,
        };

        return;
      }

      ctx.app.emit('error', err, ctx);
    }
  }

  public login = async (ctx: Context): Promise<void> => {
    try {
      const payload = (ctx.request as any).auth as BritaTokenPayload;

      const result = await this.userService.activateAccount(payload);

      ctx.response.status = result ? 204 : 404;
      ctx.response.body = null;
    } catch (err) {
      if (err instanceof UserError) {
        ctx.response.status = 400;
        ctx.response.body = {
          data: null,
          error: err.message,
        };

        return;
      }

      ctx.app.emit('error', err, ctx);
    }
  }
}
