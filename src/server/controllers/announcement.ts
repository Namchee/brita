import { AnnouncementService } from '../services/announcement';
import { Context } from 'koa';
import { UserError } from '../utils/error';

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
   * Get announcements from the app by query criteria
   *
   * @param {Context} ctx Koa context object
   * @return {Promise<void>} Sets the koa response object
   */
  public find = async (ctx: Context): Promise<void> => {
    try {
      const result = await this.service.find(ctx.request.query);

      ctx.response.status = 200;
      ctx.response.body = {
        data: result,
        error: null,
      };
    } catch (err) {
      if (err instanceof UserError) {
        ctx.response.status = 400;
        ctx.response.body = {
          data: null,
          error: err.message,
        };

        return;
      }

      ctx.app.emit('error', err, ctx);
    }
  }
}
