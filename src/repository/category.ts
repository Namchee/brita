import {
  EntityManager,
  EntityRepository as BaseEntityRepository,
  Repository,
} from 'typeorm';
import { TypeORMRepository, EntityRepository, PagingOptions } from './base';
import { Category } from './../entity/category';
import {
  CategoryEntity,
  CategoryWithCount,
} from './../database/model/category';

interface FindCategoryOptions extends PagingOptions {
  limit?: number;
  offset?: number;
  desc?: boolean;
}

export interface CategoryRepository extends EntityRepository<Category> {
  exist(id: number): Promise<boolean>;
  findAllWithoutCount(options?: FindCategoryOptions): Promise<Category[]>;
  findByName(
    name: string,
  ): Promise<Category | null>;
  create(
    name: string,
    desc: string,
  ): Promise<Category | null>;
}
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

  protected get repository(): Repository<Category> {
    return this.manager.getRepository(CategoryEntity);
  }

  public exist = async (id: number): Promise<boolean> => {
    const count = await this.repository.findOne(id);

    return !!count;
  }

  public findAll = async (
    options?: FindCategoryOptions,
  ): Promise<Category[]> => {
    const fields = [
      'category.id',
      'category.name',
      'category.announcementCount',
    ];

    if (options?.desc) {
      fields.push('category.desc');
    }

    return this.manager.getRepository(CategoryWithCount)
      .createQueryBuilder('category')
      .select(fields)
      .limit(options?.limit)
      .offset(options?.offset)
      .getMany();
  }

  public findAllWithoutCount = async (
    options?: FindCategoryOptions,
  ): Promise<Category[]> => {
    const fields = [
      'category.id',
      'category.name',
    ];

    if (options?.desc) {
      fields.push('category.desc');
    }

    return this.repository.createQueryBuilder('category')
      .select(fields)
      .limit(options?.limit)
      .offset(options?.offset)
      .getMany();
  }

  public findByName = async (name: string): Promise<Category | null> => {
    const category = await this.repository
      .createQueryBuilder('category')
      .where('lower(category.name) = lower(:name)', { name })
      .getOne();

    return category ? category : null;
  }

  public create = async (
    name: string,
    desc: string,
  ): Promise<Category | null> => {
    try {
      const insertResult = await this.repository.insert({
        name,
        desc,
      });

      return insertResult.generatedMaps[0] as Category;
    } catch (err) {
      return null;
    }
  }

  public delete = async (id: number): Promise<boolean> => {
    const deleteResult = await this.repository.delete(id);

    return !!deleteResult.affected;
  }

  public update = async (
    {
      id,
      name,
      desc,
    }: Category,
  ): Promise<boolean> => {
    const updateResult = await this.repository.update(
      id,
      {
        name,
        desc,
      },
    );

    return !!updateResult.affected;
  }
}
