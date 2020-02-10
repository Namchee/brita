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
   * HTTP status indicator for this error
   */
  public readonly status: number;

  /**
   * Constructor for ServerError
   * @param {string} message Error message, preferably the reason
   * why the error occured
   * @param {number=} status A HTTP status indicator. The default value
   * is `500`
   */
  public constructor(message: string, status?: number) {
    super(`ServerError: ${message}`);

    this.status = status || 500;
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
   * Constructor for ServerError
   * @param {string} message Error message, preferably the reason
   * why the error occured
   */
  public constructor(message: string) {
    super(message);
  }
}
