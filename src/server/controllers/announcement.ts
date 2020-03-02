import { AnnouncementService } from '../services/announcement';
import { Context } from 'koa';

/**
 * Controller class for Announcement REST API
 */
export class AnnouncementController {
  /**
   * Services which the controller calls from
   */
  private readonly service: AnnouncementService;

  /**
   * Constructor for AnnouncementController
   *
   * @param {AnnouncementService} service Announcement services
   */
  public constructor(service: AnnouncementService) {
    this.service = service;
  }

  /**
   * Get all announcements from the app
   *
   * @param {Context} ctx Koa context object
   * @return {Promise<void>} Sets the koa response object
   */
  public findAll = async (ctx: Context): Promise<void> => {
    return;
  }
}
