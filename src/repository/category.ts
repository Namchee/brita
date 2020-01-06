import { TypeORMRepository, EntityRepository } from './base';
import { Category } from '../entity/category';
import {
  EntityManager,
  EntityRepository as BaseEntityRepository,
  Repository,
} from 'typeorm';
import { CategoryEntity, CategoryWithCount } from '../database/model/category';

/**
 * An interface for category repository
 *
 * Any concrete Category repository implementation MUST implement
 * this interface (including the mocked one)
 */
export interface CategoryRepository extends EntityRepository<Category> {
  /**
   * Get a category by its name
   *
   * As category name is unique, this method only return one category
   * @param {string} name Name of the category
   * @return {Promise<Category>} A category which satisfies the criterion
   * or `null` if it doesn't find it
   */
  findByName(
    name: string,
  ): Promise<Category | null>;
  /**
   * Creates a new Category
   *
   * @param {string} name Name of the category
   * @param {string} desc Description of the category
   * @return {Promise<CategoryDocument>} The newly created `Category`
   * if successful, `null` otherwise
   */
  create(
    name: string,
    desc: string,
  ): Promise<Category | null>;
}

/**
 * Category repository implemented with typeorm
 *
 * It abstracts database access for Categories from complex queries
 */
@BaseEntityRepository(CategoryEntity)
export class CategoryRepositoryTypeORM
  extends TypeORMRepository<Category>
  implements CategoryRepository {
  /**
   * Constructor for Category repository implemented with typeORM
   * @param {EntityManager} manager Entity manager
   */
  public constructor(manager: EntityManager) {
    super(manager);
  }

  /**
   * Get the default typeORM repository for the entity
   *
   * @return {Repository<Category>} Default typeORM repository
   */
  protected get repository(): Repository<Category> {
    return this.manager.getRepository(CategoryEntity);
  }

  /**
   * Get all categories from the database, including the `count`
   * value
   *
   * @return {Promise<Category[]>} Array of categories
   */
  public findAll = async (): Promise<Category[]> => {
    return await this.manager.getRepository(CategoryWithCount)
      .createQueryBuilder('category')
      .getMany();
  }

  /**
   * Get a category by its name
   *
   * The comparison is done with strict equality, not `LIKE` clause
   *
   * As category name is unique, this method only return one category
   * @param {string} name Name of the category
   * @return {Promise<Category | null>} A category which satisfies the criterion
   * or `null` if it doesn't find it
   */
  public findByName = async (name: string): Promise<Category | null> => {
    const category = await this.repository
      .createQueryBuilder('category')
      .where('lower(category.name) = lower(:name)', { name })
      .getOne();

    return category ? category : null;
  }

  /**
   * Creates a new category and insert it into the database
   *
   * @param {string} name Name of the category, must be unique
   * @param {string} desc Description for the category
   * @return {Category} The newly inserted category
   */
  public create = async (name: string, desc: string): Promise<Category> => {
    return await this.repository.save({
      name,
      desc,
    });
  }

  /**
   * Deletes a category from the database
   *
   * If a category is deleted, the announcement will NOT be dropped
   *
   * @param {string} id ID of target category
   * @return {Promise<boolean>} `true` if deletion is successful,
   * `false` otherwise
   */
  public delete = async (id: string): Promise<boolean> => {
    const deleteResult = await this.repository.delete({ id });

    return !!deleteResult.affected;
  }

  /**
   * Updates a category with given arguments
   *
   * @param {Category} obj Category object
   * @return {Promise<boolean>} `true` if update is successful,
   * `false` otherwise
   */
  public update = async (
    {
      id,
      name,
      desc,
    }: Category,
  ): Promise<boolean> => {
    const updateResult = await this.repository.update(
      { id },
      {
        name,
        desc,
      },
    );

    return !!updateResult.affected;
  }
}
