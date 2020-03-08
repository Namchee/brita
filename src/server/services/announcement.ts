import Joi from '@hapi/joi';
import { AnnouncementRepository } from '../repository/announcement';
import { Announcement } from '../entity/announcement';
import { UserError } from '../utils/error';

/**
 * Service for handling announcement REST API request
 */
export class AnnouncementService {
  /**
   * Announcement data source, a.k.a repository
   */
  private readonly repository: AnnouncementRepository;

  /**
   * Validation schema for `find` method
   */
  private static readonly FIND_SCHEMA = Joi.object({
    limit: Joi.number().min(0),
    offset: Joi.number().min(0),
    category: Joi.string(),
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
   * Get announcements from data source by query criteria
   *
   * @param {object} params Request query criteria
   * @return {Promise<Announcement[]>} Array of announcements
   */
  public find = async (params?: any): Promise<Announcement[]> => {
    const validation = AnnouncementService.FIND_SCHEMA.validate(params);

    if (validation.error) {
      throw new UserError(validation.error.message);
    }

    const paginationOptions = {
      limit: params?.limit,
      offset: params?.offset,
    };

    return params?.category ?
      this.repository.findByCategory(params.category, paginationOptions) :
      this.repository.findAll(paginationOptions);
  }
}
