import { Context } from 'koa';
import { LineBotServiceHub } from '../services/bot';

/**
 * Controller for handling LINE webhook endpoint
 */
export class LineBotController {
  private readonly serviceHub: LineBotServiceHub;

  /**
   * Constructor for LineBotController
   *
   * @param {LineBotServiceHub} serviceHub Service hub instance
   */
  public constructor(serviceHub: LineBotServiceHub) {
    this.serviceHub = serviceHub;
  }

  /**
   * Handles a webhook request with Koa's context
   *
   * @param {Context} ctx Koa context object
   * @return {Promise<void>} Sets Koa response object and terminate the
   * execution pipeline
   */
  public handleRequest = async (ctx: Context): Promise<void> => {
    try {
      const botQueryResult = await Promise.all(
        ctx.request.body.events.map(this.serviceHub.handleBotQuery),
      );

      ctx.response.status = 200;
      ctx.response.body = botQueryResult;
    } catch (err) {
      ctx.app.emit('error', err, ctx);
    }
  }
}
