import { ServerError } from '../../utils/error';

/**
 * Message Body
 *
 * It represents the contents of the message
 *
 * Every Message must contain at least one `MessageBody`
 */
export interface MessageBody {
  type: string;
  text: string;
}

export interface ButtonBody extends MessageBody {
  label: string;
}

export interface Message {
  type: string;
  body: MessageBody[];
}

/**
 * Creates a normal text body
 *
 * Basically, use this if you want format the message as plain-text
 * @param {string} text Message text
 * @return {MessageBody} A plain-text `MessageBody`
 */
export function createTextBody(text: string): MessageBody {
  return {
    type: 'text',
    text,
  };
}

/**
 * Creates a button body
 *
 * A button consist of 2 components
 *  1. `label`, Button label
 *  2. `text`, A text which will be sent when the button is clicked
 * @param {string} label Button label
 * @param {string} text A plain-text to be sent when button is clicked.
 * Maximum length is 20 characters, otherwise it will be trimmed
 * @return {ButtonBody} A button `MessageBody`
 */
export function createButtonBody(label: string, text: string): ButtonBody {
  return {
    type: 'button',
    label: label.substring(0, 20),
    text,
  };
}

/**
 * Creates a new basic plain-text message
 * @param {MessageBody} textBody A `MessageBody` to be sent.
 * Must only be a plain-text body, otherwise it will throw an error
 * @return {Message} Basic plain-text message
 */
export function createTextMessage(textBody: MessageBody): Message {
  if (textBody.type !== 'text') {
    throw new ServerError('A text message should only contain "text" body');
  }

  return {
    type: 'basic',
    body: [textBody],
  };
}

/**
 * Creates a new interactive button message
 *
 * May contain a descriptive text
 * @param {MessageBody[]} body A `MessageBody` array, must at least
 * include one `button` body
 * @return {Message} Interactive button message
 */
export function createButtonMessage(body: MessageBody[]): Message {
  const hasButtonInside = body.some(
    (obj: MessageBody) => obj.type === 'button',
  );

  if (!hasButtonInside) {
    throw new ServerError(
      'A button message should contain at least one "button" body',
    );
  }

  return {
    type: 'buttons',
    body,
  };
}

/**
 * Creates a new carousel message, which wraps a bunch of messages in
 * single message (think of a simple web carousel)
 * @param {MessageBody[]} body Message body
 * @return {Message} A carousel message
 */
export function createCarouselMessage(body: MessageBody[]): Message {
  return {
    type: 'carousel',
    body,
  };
}

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
