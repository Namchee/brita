import Joi from '@hapi/joi';
import { AnnouncementRepository } from '../repository/announcement';
import { Announcement } from '../entity/announcement';
import { UserError } from '../utils/error';
import { CategoryRepository } from '../repository/category';
import { ERROR_MESSAGE, ANNOUNCEMENT_ERROR_MESSAGE } from './err.msg';

/**
 * Service for handling announcement REST API request
 */
export class AnnouncementService {
  /**
   * Validation schema for `find` method
   */
  private static readonly FIND_SCHEMA = Joi.object({
    limit: Joi.number()
      .error(new Error(ERROR_MESSAGE.LIMIT_IS_NUMBER))
      .min(1).error(new Error(ERROR_MESSAGE.LIMIT_MINIMUM_ONE)),
    start: Joi.number().error(new Error(ERROR_MESSAGE.OFFSET_IS_NUMBER))
      .min(0).error(new Error(ERROR_MESSAGE.OFFSET_NON_NEGATIVE)),
    category: Joi.number()
      .error(new Error(ANNOUNCEMENT_ERROR_MESSAGE.CATEGORY_IS_NUMBER)),
  });

  private static readonly CREATE_SCHEMA = Joi.object({
    title: Joi.string()
      .error(new Error(ANNOUNCEMENT_ERROR_MESSAGE.TITLE_IS_STRING))
      .required().error(new Error(ANNOUNCEMENT_ERROR_MESSAGE.TITLE_IS_REQUIRED))
      .min(3).error(new Error(ANNOUNCEMENT_ERROR_MESSAGE.TITLE_MINIMUM_LIMIT))
      .max(50).error(new Error(ANNOUNCEMENT_ERROR_MESSAGE.TITLE_MAXIMUM_LIMIT))
      .regex(/^[a-zA-Z0-9 -,.]/)
      .error(new Error(ANNOUNCEMENT_ERROR_MESSAGE.TITLE_CHARACTER_LIMIT)),
    contents: Joi.string()
      .error(new Error(ANNOUNCEMENT_ERROR_MESSAGE.CONTENTS_IS_STRING))
      .required()
      .error(new Error(ANNOUNCEMENT_ERROR_MESSAGE.CONTENTS_IS_REQUIRED))
      .min(10)
      .error(new Error(ANNOUNCEMENT_ERROR_MESSAGE.CONTENTS_MINIMUM_LIMIT))
      .max(250)
      .error(new Error(ANNOUNCEMENT_ERROR_MESSAGE.CONTENTS_MAXIMUM_LIMIT)),
    validUntil: Joi.date()
      .error(new Error(ANNOUNCEMENT_ERROR_MESSAGE.VALID_IS_DATE))
      .required()
      .error(new Error(ANNOUNCEMENT_ERROR_MESSAGE.VALID_IS_REQUIRED))
      .iso().error(new Error(ANNOUNCEMENT_ERROR_MESSAGE.VALID_IS_ISO)),
    categories: Joi.array()
      .error(new Error(ANNOUNCEMENT_ERROR_MESSAGE.CATEGORIES_IS_ARRAY))
      .required()
      .error(new Error(ANNOUNCEMENT_ERROR_MESSAGE.CATEGORIES_IS_REQUIRED))
      .min(1)
      .error(new Error(ANNOUNCEMENT_ERROR_MESSAGE.CATEGORIES_MINIMUM_LIMIT))
      .max(5)
      .error(new Error(ANNOUNCEMENT_ERROR_MESSAGE.CATEGORIES_MAXIMUM_LIMIT))
      .items(Joi.number())
      .error(new Error(ANNOUNCEMENT_ERROR_MESSAGE.CATEGORIES_IS_ID_ARRAY)),
  });

  private static readonly UPDATE_SCHEMA = AnnouncementService.CREATE_SCHEMA
    .keys({
      id: Joi.number().error(new Error(ANNOUNCEMENT_ERROR_MESSAGE.ID_IS_NUMBER))
        .required().error(new Error(ANNOUNCEMENT_ERROR_MESSAGE.ID_IS_REQUIRED)),
    });

  /**
   * Constructor for AnnouncementService
   *
   * @param {AnnouncementRepository} announcementRepository
   * Data source for announcements
   * @param {categoryRepository} categoryRepository Data source for categories
   */
  public constructor(
    private readonly announcementRepository: AnnouncementRepository,
    private readonly categoryRepository: CategoryRepository,
  ) { }

  /**
   * Get announcements from data source by query criteria
   *
   * @param {object} params Request query criteria
   * @return {Promise<AnnouncementDTO[]>} Array of announcements
   */
  public find = async (params: any): Promise<Announcement[]> => {
    const validation = AnnouncementService.FIND_SCHEMA.validate(params);

    if (validation.error) {
      throw new UserError(validation.error.message);
    }

    const paginationOptions = {
      limit: params.limit,
      offset: params.start,
    };

    if (params.category) {
      return await this.announcementRepository.findByCategory(
        params.category,
        paginationOptions,
      );
    }

    return await this.announcementRepository.findAll(
      paginationOptions,
    );
  }

  /**
   * Creates a new announcement in the app
   *
   * @param {object} params Announcement's data
   * @return {Promise<AnnouncementDTO>} Newly created Announcement
   */
  public create = async (params: any): Promise<Announcement> => {
    const validation = AnnouncementService.CREATE_SCHEMA.validate(params);

    if (validation.error) {
      throw new UserError(validation.error.message);
    }

    await this.checkAnnouncementValidity(params);

    const insertResult = await this.announcementRepository.create(
      params.title,
      params.content,
      new Date(params.valid_until),
      params.categories,
    );

    if (!insertResult) {
      throw new UserError(ANNOUNCEMENT_ERROR_MESSAGE.TITLE_ALREADY_EXIST);
    }

    return insertResult;
  }

  /**
   * Deletes an announcement from the app
   *
   * @param {number} id Announcement's ID
   * @return {Promise<boolean>} `true` if deletion performed successfully,
   * `false` otherwise
   */
  public delete = async (id: number): Promise<boolean> => {
    return await this.announcementRepository.delete(id);
  }

  /**
   * Updates an announcement in the app with new data
   *
   * @param {object} params Announcement's ID and new announcement data
   * @return {Promise<boolean>} `true` if update performed successfully,
   * `false` otherwise
   */
  public update = async (params: any): Promise<boolean> => {
    const validation = AnnouncementService.UPDATE_SCHEMA.validate(params);

    if (validation.error) {
      throw new UserError(validation.error.message);
    }

    const oldAnnouncement = await this.announcementRepository.findById(
      params.id,
    );

    if (!oldAnnouncement) {
      throw new UserError(ANNOUNCEMENT_ERROR_MESSAGE.ANNOUNCEMENT_NOT_EXIST);
    }

    if (new Date(oldAnnouncement.validUntil).getTime() < Date.now()) {
      throw new UserError(ANNOUNCEMENT_ERROR_MESSAGE.VALID_HAS_EXPIRED);
    }

    await this.checkAnnouncementValidity(params);

    return await this.announcementRepository.update(params as Announcement);
  }

  /**
   * A utility function to perform validation before creation or update
   * on an announcement with some business logic
   *
   * @param {object} params Data to be validated
   * @return {Promise<void>} Will throw an Error if data is invalid
   */
  private async checkAnnouncementValidity(params: any): Promise<void> {
    const validDate = new Date(params['valid_until']);

    if (validDate.getTime() < Date.now()) {
      throw new UserError(ANNOUNCEMENT_ERROR_MESSAGE.VALID_IS_LATER);
    }

    const categories = await Promise.all(
      params.categories.map((category: number) => {
        return this.categoryRepository.exist(category);
      }),
    );

    if (categories.some((category => !category))) {
      throw new UserError(ANNOUNCEMENT_ERROR_MESSAGE.CATEGORY_NOT_EXIST);
    }
  }
}
