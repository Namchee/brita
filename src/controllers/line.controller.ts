import { Context, Next } from 'koa';
import { Controller } from './base';
import { BotServiceHub } from '../services/bot.hub';
import { ServerError } from '../utils/error';
import Sentry from '@sentry/node';

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
        Sentry.captureException(err);
      }

      ctx.response.status = 500;
    }
  }
}
