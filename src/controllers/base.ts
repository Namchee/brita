import { Next, Context } from 'koa';

export interface Controller {
  handleRequest(ctx: Context, next: Next): Promise<void>;
}
