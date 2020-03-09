import Joi from '@hapi/joi';
import { CategoryRepository } from '../repository/category';
import { Category } from '../entity/category';
import { UserError } from '../utils/error';
import { PagingOptions } from '../repository/base';

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

  private static readonly CREATE_SCHEMA = Joi.object({
    name: Joi.string().min(3).max(25).regex(/^[a-zA-Z ]/).required(),
    desc: Joi.string().min(10).max(100).required(),
  });

  private static readonly UPDATE_SCHEMA = CategoryService.CREATE_SCHEMA.keys({
    id: Joi.number().required(),
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
  public findAll = async (params: any): Promise<Category[]> => {
    const validation = CategoryService.FIND_SCHEMA.validate(params);

    if (validation.error) {
      throw new UserError(validation.error.message);
    }

    return this.repository.findAll(params as PagingOptions);
  }

  /**
   * Get categories by its name from the data source
   * This method will perform a search with equality operator, not
   * SQL's `LIKE` operator
   *
   * @param {string} name Name of the category
   * @return {Promise<Category | null>} A category with exactly same name
   * as the parameters if found, `null` otherwise
   */
  public findByName = async (name: string): Promise<Category | null> => {
    const validation = Joi.string().validate(name);

    if (validation.error) {
      throw new UserError(validation.error.message);
    }

    return this.repository.findByName(name);
  }

  /**
   * Create a new category entity and save it in the database
   *
   * @param {object} body Category's data
   * @return {Category} Newly created category
   */
  public create = async (body: any): Promise<Category> => {
    const validation = CategoryService.CREATE_SCHEMA.validate(body);

    if (validation.error) {
      throw new UserError(validation.error.message);
    }

    const insertResult = await this.repository.create(body.name, body.desc);

    if (!insertResult) {
      throw new UserError('Category with same name already exist');
    }

    return insertResult;
  }

  /**
   * Deletes an entity from the database
   *
   * @param {number} id Category's ID
   * @return {Promise<boolean>} `true` if deletion performed successfully
   * (number of affected > 0), `false` otherwise
   */
  public delete = async (id: number): Promise<boolean> => {
    return await this.repository.delete(id);
  }

  /**
   * Updates an entity on the database
   *
   * @param {object} body Category data
   * @return {Promise<boolean>} `true` if update performed successfully
   * (number of affected > 0), `false` otherwise
   */
  public update = async (body: any): Promise<boolean> => {
    const validation = CategoryService.UPDATE_SCHEMA.validate(body);

    if (validation.error) {
      throw new UserError(validation.error.message);
    }

    return await this.repository.update(body as Category);
  }
}
