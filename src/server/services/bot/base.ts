import { Message } from '@line/bot-sdk';
import { StringMap } from '../../utils/types';

/**
 * An interface which defines parameters for Bot service
 */
export interface BotServiceParameters {
  state: number;
  text: string;
  timestamp: number;
  misc?: StringMap;
}

/**
 * An interface which defines parameters for service handlers
 */
export interface HandlerParameters {
  text: string;
  timestamp?: number;
  misc?: StringMap;
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
   * Message(s) to be sent by LINE
   *
   * Return more than one object to conduct push messages
   */
  message: Message[];
  /**
   * Miscellanous data
   *
   * Useful for caching or keeping extra state
   */
  misc?: StringMap;
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
