import { Context, Next } from 'koa';
import { Controller } from './base';
import { LineBotServiceHub } from './../services/bot.hub';

/**
 * Controller for handling LINE webhook endpoint
 */
export class LineBotController implements Controller {
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
   * @param {Next} next Next function
   */
  public handleRequest = async (ctx: Context, next: Next): Promise<void> => {
    try {
      const botQueryResult = await Promise.all(
        ctx.request.body.events.map(this.serviceHub.handleBotQuery),
      );

      ctx.response.status = 200;
      ctx.response.body = botQueryResult;
    } catch (err) {
      ctx.response.status = 500;
      ctx.response.body = null;

      ctx.app.emit('error', err, ctx);
    }
  }
}
