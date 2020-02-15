import { Context, Next } from 'koa';

/**
 * Base interface for all controller implementation
 *
 * It is specifically tuned to be used with Koa
 */
export interface Controller {
  /**
   * Handles a HTTP request with Express
   *
   * @param {Request} req Express request object
   * @param {Response} res Express response object
   * @param {NextFunction} next Next Function
   * @return {Promise<Response>} An express response object
   */
  handleRequest(
    ctx: Context,
    next: Next
  ): Promise<void>;
}
