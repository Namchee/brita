/**
 * A class which indicates a server-related error has happened
 * (e.g. something which violates the business rules)
 *
 * This class extends the original `Error` class
 *
 * It adds HTTP status indicator for error handling purposes
 *
 * This kind of error is not meant to be sent to consumer
 */
export class ServerError extends Error {
  /**
   * Constructor for ServerError
   * @param {string} message Error message, preferably the reason
   * why the error occured
   * @param {number=500} status A HTTP status indicator. The default value
   * is `500`
   */
  public constructor(message: string, public readonly status = 500) {
    super(`ServerError: ${message}`);
  }
}

/**
 * A class which indicates a user-related error has happened
 * (e.g. unrecognized request)
 *
 * This class extends the original `Error` class
 *
 * This kind of error is meant to be sent to the consumer
 */
export class UserError extends Error {
  /**
   * Constructor for UserError
   *
   * @param {string} message Error message, preferably the reason
   * why the error occured
   * @param {number=400} status Status code for error response
   */
  public constructor(message: string, public readonly status = 400) {
    super(message);
  }
}
