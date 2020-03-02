import { CategoryService } from '../services/category';
import { Context } from 'koa';

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
    return;
  }
}
