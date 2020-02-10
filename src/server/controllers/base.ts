import { Next, Context } from 'koa';

/**
 * Base interface for all controller implementation
 *
 * It is specifically tuned to be used with Koa
 */
export interface Controller {
  /**
   * Handles a Koa request
   *
   * @param {Context} ctx Koa context object
   * @param {Next} next Next function
   * @return {Promise<void>} A promise per Koa's convention.
   * It will return `void` as Koa will directly mutate the provided
   * context object
   */
  handleRequest(ctx: Context, next: Next): Promise<void>;
}
