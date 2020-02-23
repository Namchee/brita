import {
  Message as LineMessage,
  TextMessage,
  FlexMessage,
  FlexButton,
  FlexText,
  FlexBubble,
  FlexComponent,
  FlexCarousel,
  FlexContainer,
} from '@line/bot-sdk';
import { Message, ButtonBody, CarouselBody } from './messages';
import { ServerError } from './../../../utils/error';

function generateLineTextMessage(text: string): TextMessage {
  return {
    type: 'text',
    text,
  };
}

function generateTextComponent(
  text: string,
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl',
  bold?: boolean,
): FlexText {
  const textObject = generateLineTextMessage(text);

  return {
    size: size || 'sm',
    ...textObject,
    wrap: true,
    weight: bold ? 'bold' : 'regular',
  };
}

function generateButtonComponent(
  label: string,
  text: string,
  solid?: boolean,
): FlexButton {
  return {
    type: 'button',
    action: {
      type: 'message',
      text,
      label,
    },
    height: 'sm',
    style: solid ? 'primary' : 'link',
    color: solid ? '#2196F3' : '#212121',
  };
}

function generateBubbleContainer(
  body: FlexComponent[],
  header?: FlexComponent,
  footer?: FlexButton,
  padding?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl',
): FlexBubble {
  const elem: FlexComponent[] = [];

  if (header) {
    elem.push(header);
  }

  elem.push(...body);

  if (footer) {
    elem.push({
      type: 'separator',
    })
    elem.push(footer);
  }

  const bubbleContainer: FlexBubble = {
    type: 'bubble',
    body: {
      type: 'box',
      layout: 'vertical',
      paddingAll: padding,
      paddingStart: '30px',
      paddingEnd: '30px',
      contents: elem,
      spacing: 'xxl',
    },
    action: footer?.action || undefined,
  };

  return bubbleContainer;
}

function generateCarouselContainer(contents: FlexBubble[]): FlexCarousel {
  return {
    type: 'carousel',
    contents,
  };
}

function generateFlexMessage(contents: FlexContainer): FlexMessage {
  return {
    type: 'flex',
    altText: '\0',
    contents,
  };
}

/**
 * Formats a message to approriate LINE message counterpart
 *
 * @param {Message} message Message to be formatted
 * @return {LineMessage} A preformatted LINE message
 */
function generateLineMessage(
  message: Message,
): LineMessage {
  switch (message.type) {
  case 'basic': {
    if (message.body.length > 1) {
      throw new ServerError('A basic message can only contain 1 body');
    }

    return generateLineTextMessage(message.body[0].text);
  }
  case 'buttons': {
    const buttons = message.body as ButtonBody[];

    const messageComponents = buttons.map((button) => {
      return generateButtonComponent(button.label, button.text, button.solid);
    });

    const boxContainer = generateBubbleContainer(messageComponents);

    return generateFlexMessage(boxContainer);
  }
  case 'carousel': {
    const bubbles = message.body as CarouselBody[];

    const messageComponents = bubbles.map((bubble) => {
      const body = generateTextComponent(bubble.text, bubble.size);

      const header = bubble.header ?
        generateTextComponent(bubble.header, 'xxl') :
        undefined;

      const footer = bubble.action ?
        generateButtonComponent(bubble.action.label, bubble.action.text, true) :
        undefined;

      return generateBubbleContainer([body], header, footer);
    });

    const carouselContainer = generateCarouselContainer(messageComponents);
    return generateFlexMessage(carouselContainer);
  }
  default:
    throw new ServerError('Illegal message type', 500);
  }
}

/**
 * Formats messages to LINE-compatible message objects
 *
 * @param {Message[]} messages Array of `Message`(s)
 * @return {LineMessage | LineMessage[]} A LINE-compatible message object(s)
 */
export function formatMessages(
  messages: Message[],
): LineMessage | LineMessage[] {
  if (messages.length === 1) {
    return generateLineMessage(messages[0]);
  } else {
    return messages.map(
      message => generateLineMessage(message),
    );
  }
}
