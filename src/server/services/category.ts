import Joi from '@hapi/joi';
import { CategoryRepository } from '../repository/category';
import { Category } from '../entity/category';
import { UserError } from '../utils/error';
import { CATEGORY_ERROR_MESSAGE, ERROR_MESSAGE } from './err.msg';

export class CategoryService {
  private static readonly FIND_SCHEMA = Joi.object({
    limit: Joi.number().error(new Error(ERROR_MESSAGE.LIMIT_IS_NUMBER))
      .min(1).error(new Error(ERROR_MESSAGE.LIMIT_MINIMUM_ONE)),
    start: Joi.number().error(new Error(ERROR_MESSAGE.OFFSET_IS_NUMBER))
      .min(0).error(new Error(ERROR_MESSAGE.OFFSET_NON_NEGATIVE)),
    count: Joi.boolean()
      .error(new Error(CATEGORY_ERROR_MESSAGE.COUNT_IS_BOOLEAN))
      .allow(true, false)
      .error(new Error(CATEGORY_ERROR_MESSAGE.COUNT_UNAMBIGUOUS_BOOLEAN)),
    desc: Joi.boolean()
      .error(new Error(CATEGORY_ERROR_MESSAGE.DESC_IS_BOOLEAN))
      .allow(true, false)
      .error(new Error(CATEGORY_ERROR_MESSAGE.DESC_UNAMBIGUOUS_BOOLEAN)),
  });

  private static readonly CREATE_SCHEMA = Joi.object({
    name: Joi.string().error(new Error(CATEGORY_ERROR_MESSAGE.NAME_IS_STRING))
      .required().error(new Error(CATEGORY_ERROR_MESSAGE.NAME_IS_REQUIRED))
      .min(3).error(new Error(CATEGORY_ERROR_MESSAGE.NAME_MINIMUM_LIMIT))
      .max(25).error(new Error(CATEGORY_ERROR_MESSAGE.NAME_MAXIMUM_LIMIT))
      .regex(/^[a-zA-Z ]/)
      .error(new Error(CATEGORY_ERROR_MESSAGE.NAME_ONLY_ALPHA)),
    desc: Joi.string().error(new Error(CATEGORY_ERROR_MESSAGE.DESC_IS_STRING))
      .required().error(new Error(CATEGORY_ERROR_MESSAGE.DESC_IS_REQUIRED))
      .min(10).error(new Error(CATEGORY_ERROR_MESSAGE.DESC_MINIMUM_LIMIT))
      .max(100).error(new Error(CATEGORY_ERROR_MESSAGE.DESC_MAXIMUM_LIMIT)),
  });

  private static readonly UPDATE_SCHEMA = CategoryService.CREATE_SCHEMA.keys({
    id: Joi.number().error(new Error(CATEGORY_ERROR_MESSAGE.ID_IS_NUMBER))
      .required().error(new Error(CATEGORY_ERROR_MESSAGE.ID_IS_REQUIRED)),
  });

  public constructor(private readonly repository: CategoryRepository) { }

  public findAll = async (params: any): Promise<Category[]> => {
    const validation = CategoryService.FIND_SCHEMA.validate(params);

    if (validation.error) {
      throw new UserError(validation.error.message);
    }

    const paginationOptions = {
      limit: params.limit,
      offset: params.start,
      desc: params.desc !== 'false',
    };

    return params.count === 'true' ?
      await this.repository.findAll(paginationOptions) :
      await this.repository.findAllWithoutCount(paginationOptions);
  }

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

  public delete = async (id: number): Promise<boolean> => {
    return await this.repository.delete(id);
  }

  public update = async (body: any): Promise<boolean> => {
    const validation = CategoryService.UPDATE_SCHEMA.validate(body);

    if (validation.error) {
      throw new UserError(validation.error.message);
    }

    return await this.repository.update(body as Category);
  }
}
