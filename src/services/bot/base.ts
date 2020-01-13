import { Message } from './messaging/messages';

/**
 * An interface which defines parameters for Bot service
 */
export interface BotServiceParameters {
  state: number;
  text: string;
  provider?: string;
  account?: string;
}

/**
 * An interface which defines parameters for service handlers
 */
export interface HandlerParameters {
  text: string;
  provider?: string;
  account?: string;
}

/**
 * An interface which defines result of bot service
 *
 * All service handlers MUST return this object
 */
export interface BotServiceResult {
  /**
   * State of the service, used in stateful service
   */
  state: number;
  /**
   * Array of messages
   *
   * It is designed as an array to support multiple messages pushing
   */
  message: Message[];
}

export type BotServiceHandler = (
  params: HandlerParameters,
) => Promise<BotServiceResult>;

/**
 * An abstract class for bot service
 *
 * Implement this for any concrete service implementation
 */
export abstract class BotService {
  public readonly identifier: string;
  public readonly userRelated: boolean;
  protected handler: BotServiceHandler[];

  /**
   * Constructor for bot service
   * @param {string} identifier Service identifier, used for
   * state management
   * @param {string} userRelated An identifier to determine
   * if the service requires user information or not
   * @param {BotServiceHandler[]} handler Array of `ServiceHandler`
   */
  public constructor(
    identifier: string,
    userRelated: boolean,
  ) {
    this.identifier = identifier;
    this.userRelated = userRelated;
  }

  public abstract handle(
    params: BotServiceParameters
  ): Promise<BotServiceResult>;
}
