import Joi from '@hapi/joi';
import { CategoryRepository } from '../repository/category';
import { PagingOptions } from '../repository/base';
import { Category } from '../entity/category';
import { UserError } from '../utils/error';

/**
 * Service for handling category REST request
 */
export class CategoryService {
  /**
   * Data source for categories, a.k.a repository
   */
  private readonly repository: CategoryRepository;

  /**
   * Validation schema for `findAll` method
   */
  private static readonly FIND_ALL_SCHEMA = Joi.object({
    limit: Joi.number().positive().required(),
    offset: Joi.number().positive().required(),
  });

  /**
   * Constructor for CategoryService
   *
   * @param {CategoryRepository} repository Data source for categories
   */
  public constructor(repository: CategoryRepository) {
    this.repository = repository;
  }

  /**
   * Get all announcements from data source
   *
   * @param {PagingOptions=} params Pagination options (optional)
   * @return {Promise<Category[]>} Array of categories
   */
  public findAll = async (params?: PagingOptions): Promise<Category[]> => {
    const validation = CategoryService.FIND_ALL_SCHEMA.validate(params);

    if (validation.error) {
      throw new UserError(validation.error.message);
    }

    return this.repository.findAll(params as PagingOptions);
  }
}
