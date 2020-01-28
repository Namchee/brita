import { Context, Next } from 'koa';
import { Controller } from './base';
import { BotServiceHub } from '../services/bot.hub';
import { ServerError } from '../utils/error';

export class LineController implements Controller {
  private readonly serviceHub: BotServiceHub;

  public constructor(serviceHub: BotServiceHub) {
    this.serviceHub = serviceHub;
  }

  public handleRequest = async (
    ctx: Context,
    next: Next,
  ): Promise<void> => {
    try {
      const botQueryResult = await Promise.all(
        ctx.body.events.map(this.serviceHub.handleBotQuery),
      );

      ctx.response.status = 200;
      ctx.response.body = botQueryResult;
    } catch (err) {
      if (err instanceof ServerError) {
        // call sentry
      }

      ctx.response.status = 500;
    }
  }
}
