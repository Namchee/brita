import { AnnouncementService } from '../services/announcement';
import { Context } from 'koa';
import { UserError } from '../utils/error';

/**
 * Controller class for Announcement REST API
 */
export class AnnouncementController {
  /**
   * Constructor for AnnouncementController
   *
   * @param {AnnouncementService} service Announcement services
   */
  public constructor(private readonly service: AnnouncementService) { }

  /**
   * Controller function to get announcements from the app by query criteria
   *
   * @param {Context} ctx Koa context object
   * @return {Promise<void>} Sets the koa response object
   */
  public find = async (ctx: Context): Promise<void> => {
    try {
      const result = await this.service.find(ctx.request.query);

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

  /**
   * Controller function to create a new announcement in the app
   *
   * @param {Context} ctx Koa's context object
   * @return {Promise<void>} Sets the response body
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
        ctx.response.status = err.status;

        return;
      }

      ctx.app.emit('error', err, ctx);
    }
  }

  /**
   * Controller function to delete an announcement from the app
   *
   * @param {Context} ctx Koa's context object
   * @return {Promise<void>} Sets the response body
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
        ctx.response.status = err.status;

        return;
      }

      ctx.app.emit('error', err, ctx);
    }
  }

  /**
   * Controller function to update an announcement in the app
   * with new data
   *
   * @param {Context} ctx Koa's context object
   * @return {Promise<void>} Sets the response body
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
        ctx.response.status = err.status;

        return;
      }

      ctx.app.emit('error', err, ctx);
    }
  }
}
