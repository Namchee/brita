import Joi from '@hapi/joi';
import { CategoryRepository } from '../repository/category';
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
   * Validation schema for `find` method
   */
  private static readonly FIND_SCHEMA = Joi.object({
    limit: Joi.number().min(0),
    offset: Joi.number().min(0),
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
   * Get categories from data source with query criteria
   *
   * @param {object=} params Query criteria
   * @return {Promise<Category[]>} Array of categories
   */
  public find = async (params?: any): Promise<Category[]> => {
    if (params?.name) {
      const validation = Joi.string().validate(params?.name);

      if (validation.error) {
        throw new UserError(validation.error.message);
      }

      const result = await this.repository.findByName(params?.name);

      return result ? [result] : [];
    }

    const validation = CategoryService.FIND_SCHEMA.validate(params);

    if (validation.error) {
      throw new UserError(validation.error.message);
    }

    const paginationOptions: any = {
      limit: params?.limit,
      offset: params?.offset,
    };

    return this.repository.findAll(paginationOptions);
  }
}
