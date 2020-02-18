import { ServerError } from './../../../utils/error';

/**
 * Message Body
 *
 * It represents the contents of the message
 *
 * Every Message must contain at least one `MessageBody`
 */
export interface MessageBody {
  type: 'text' | 'button' | 'bubble';
  text: string;
}

export interface ButtonBody extends MessageBody {
  type: 'button';
  label: string;
}

export interface CarouselBody extends MessageBody {
  type: 'bubble';
  header: string;
}

export interface Message {
  type: 'basic' | 'buttons' | 'carousel';
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
 * Creates a carousel body
 *
 * @param {string} title Carousel title
 * @param {string} content Carousel content
 */
export function createCarouselBody(
  title: string,
  content: string,
): CarouselBody {
  return {
    type: 'bubble',
    header: title,
    text: content,
  };
}

/**
 * Creates a new basic plain-text message
 *
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
  if (!body.some(obj => obj.type === 'button')) {
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
 *
 * @param {MessageBody[]} body Message body
 * @return {Message} A carousel message
 */
export function createCarouselMessage(body: MessageBody[]): Message {
  if (body.some(obj => obj.type !== 'bubble')) {
    throw new ServerError('A carousel messsage can only contain `bubble`s');
  }

  return {
    type: 'carousel',
    body,
  };
}
