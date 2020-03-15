import { CategoryService } from '../services/category';
import { Context } from 'koa';
import { UserError } from '../utils/error';

/**
 * Controller class for Category REST API
 */
export class CategoryController {
  /**
   * Services which the controller calls from
   */
  private readonly service: CategoryService;

  /**
   * Constructor for CategoryController
   *
   * @param {CategoryService} service Category services
   */
  public constructor(service: CategoryService) {
    this.service = service;
  }

  /**
   * Get all categories from the app
   *
   * @param {Context} ctx Koa's context object
   * @return {Promise<void>} Sets the response object
   */
  public findAll = async (ctx: Context): Promise<void> => {
    try {
      const result = await this.service.findAll(ctx.request.query);

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

  /**
   * Get a category by its name from the app
   *
   * @param {Context} ctx Koa's context object
   * @return {Promise<void>} Sets the response object
   */
  public findByName = async (ctx: Context): Promise<void> => {
    try {
      const result = await this.service.findByName(ctx.params);

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

  /**
   * Create a new category in the app
   *
   * @param {Context} ctx Koa's context object
   * @return {Promise<void>} Sets the response object
   */
  public create = async (ctx: Context): Promise<void> => {
    try {
      const result = await this.service.create(ctx.request.body);

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

  /**
   * Delete a category from the app
   *
   * @param {Context} ctx Koa's context object
   * @return {Promise<void>} Sets the response object
   */
  public delete = async (ctx: Context): Promise<void> => {
    try {
      const result = await this.service.delete(ctx.params);

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

  /**
   * Update a category in the app with new data
   *
   * @param {Context} ctx Koa's context object
   * @return {Promise<void>} Sets the response object
   */
  public update = async (ctx: Context): Promise<void> => {
    try {
      const payload = {
        id: ctx.params,
        ...ctx.request.body,
      };

      const result = await this.service.update(payload);

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
