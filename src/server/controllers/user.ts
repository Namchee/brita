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

      ctx.response.body = {
        data: result,
        error: null,
      };
      ctx.response.status = 200;
    } catch (err) {
      if (err instanceof UserError) {
        ctx.response.body = {
          data: null,
          error: err.message,
        };
        ctx.response.status = err.status;

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

      ctx.response.body = {
        data: result,
        error: null,
      };
      ctx.response.status = 201;
    } catch (err) {
      if (err instanceof UserError) {
        ctx.response.body = {
          data: null,
          error: err.message,
        };
        ctx.response.status = err.status;

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

      ctx.response.body = {
        data: result,
        error: null,
      };
      ctx.response.status = result ? 204 : 404;
    } catch (err) {
      if (err instanceof UserError) {
        ctx.response.body = {
          data: null,
          error: err.message,
        };
        ctx.response.status = err.status;

        return;
      }

      ctx.app.emit('error', err, ctx);
    }
  }

  public login = async (ctx: Context): Promise<void> => {
    try {
      const payload = (ctx.request as any).auth as BritaTokenPayload;

      const result = await this.userService.activateAccount(payload);

      ctx.response.body = null;
      ctx.response.status = result ? 204 : 404;
    } catch (err) {
      if (err instanceof UserError) {
        ctx.response.body = {
          data: null,
          error: err.message,
        };
        ctx.response.status = err.status;

        return;
      }

      ctx.app.emit('error', err, ctx);
    }
  }
}
