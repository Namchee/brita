import Joi from '@hapi/joi';
import { AnnouncementRepository } from '../repository/announcement';
import { Announcement } from '../entity/announcement';
import { UserError } from '../utils/error';
import { PagingOptions } from '../repository/base';

/**
 * Service for handling announcement REST API request
 */
export class AnnouncementService {
  /**
   * Announcement data source, a.k.a repository
   */
  private readonly repository: AnnouncementRepository;

  /**
   * Validation schema for `findAll` method
   */
  private static readonly FIND_ALL_SCHEMA = Joi.object({
    limit: Joi.number().positive().required(),
    offset: Joi.number().positive().required(),
  });

  /**
   * Constructor for AnnouncementService
   *
   * @param {AnnouncementRepository} repository Data source for announcement
   */
  public constructor(repository: AnnouncementRepository) {
    this.repository = repository;
  }

  /**
   * Get all announcements from data source
   *
   * @param {PagingOptions=} params Pagination options (optional)
   * @return {Promise<Announcement[]>} Array of announcements
   */
  public findAll = async (params?: PagingOptions): Promise<Announcement[]> => {
    const validation = AnnouncementService.FIND_ALL_SCHEMA.validate(params);

    if (validation.error) {
      throw new UserError(validation.error.message);
    }

    return this.repository.findAll(params as PagingOptions);
  }
}
