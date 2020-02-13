import { Message } from './messaging/messages';

/**
 * An interface which defines parameters for Bot service
 */
export interface BotServiceParameters {
  state: number;
  text: string;
  misc?: Map<string, any>;
}

/**
 * An interface which defines parameters for service handlers
 */
export interface HandlerParameters {
  text: string;
  misc?: Map<string, any>;
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
  /**
   * Miscellanous data
   *
   * Useful for caching or keeping extra state
   */
  misc?: Map<string, any>;
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
  protected handler: BotServiceHandler[];

  /**
   * Constructor for bot service
   * @param {string} identifier Service identifier, used for
   * state management
   * @param {string} userRelated An identifier to determine
   * if the service requires user information or not
   * @param {BotServiceHandler[]} handler Array of `ServiceHandler`
   */
  public constructor(identifier: string) {
    this.identifier = identifier;
  }

  public abstract handle(
    params: BotServiceParameters,
  ): Promise<BotServiceResult>;
}
