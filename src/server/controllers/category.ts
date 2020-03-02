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
   * @param {Context} ctx Koa context object
   * @return {Promise<void>} Sets the koa response object
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
}
