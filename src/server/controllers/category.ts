import { CategoryService } from '../services/category';
import { Context } from 'koa';
import { UserError } from '../utils/error';

/**
 * Controller class for Category REST API
 */
export class CategoryController {
  /**
   * Constructor for CategoryController
   *
   * @param {CategoryService} service Category services
   */
  public constructor(private readonly service: CategoryService) { }

  /**
   * Get all categories from the app
   *
   * @param {Context} ctx Koa's context object
   * @return {Promise<void>} Sets the response object
   */
  public findAll = async (ctx: Context): Promise<void> => {
    try {
      const result = await this.service.findAll(ctx.request.query);

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
        ctx.response.status = 400;

        return;
      }

      ctx.app.emit('error', err, ctx);
    }
  }

  /**
   * Get a category by its name from the app
   *
   * @param {Context} ctx Koa's context object
   * @return {Promise<void>} Sets the response object
   */
  public findByName = async (ctx: Context): Promise<void> => {
    try {
      const result = await this.service.findByName(ctx.params.name);

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
        ctx.response.status = 400;

        return;
      }

      ctx.app.emit('error', err, ctx);
    }
  }

  /**
   * Create a new category in the app
   *
   * @param {Context} ctx Koa's context object
   * @return {Promise<void>} Sets the response object
   */
  public create = async (ctx: Context): Promise<void> => {
    try {
      const result = await this.service.create(ctx.request.body);

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
        ctx.response.status = 400;

        return;
      }

      ctx.app.emit('error', err, ctx);
    }
  }

  /**
   * Delete a category from the app
   *
   * @param {Context} ctx Koa's context object
   * @return {Promise<void>} Sets the response object
   */
  public delete = async (ctx: Context): Promise<void> => {
    try {
      const result = await this.service.delete(ctx.params.id);

      ctx.response.body = null;
      ctx.response.status = result ? 204 : 404;
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

  /**
   * Update a category in the app with new data
   *
   * @param {Context} ctx Koa's context object
   * @return {Promise<void>} Sets the response object
   */
  public update = async (ctx: Context): Promise<void> => {
    try {
      const payload = {
        id: ctx.params.id,
        ...ctx.request.body,
      };

      const result = await this.service.update(payload);

      ctx.response.body = null;
      ctx.response.status = result ? 204 : 404;
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
}
