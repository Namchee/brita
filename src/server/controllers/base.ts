import { Context, Next } from 'koa';

/**
 * Base interface for all controller implementation
 *
 * It is specifically tuned to be used with Koa
 */
export interface Controller {
  /**
   * Handles a HTTP request in KoaJS style
   *
   * @param {Context} ctx Koa context object
   * @param {NextFunction} next Next Function
   * @return {Promise<Response>} An express response object
   */
  handleRequest(
    ctx: Context,
    next: Next
  ): Promise<void>;
}
