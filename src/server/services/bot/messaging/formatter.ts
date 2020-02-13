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
import { Message, ButtonBody } from './messages';
import { ServerError } from './../../../utils/error';

function generateLineTextMessage(text: string): TextMessage {
  return {
    type: 'text',
    text,
  };
}

function generateTextComponent(text: string): FlexText {
  return generateLineTextMessage(text) as FlexText;
}

function generateButtonComponent(label: string, text: string): FlexButton {
  return {
    type: 'button',
    action: {
      type: 'message',
      text,
      label,
    },
  };
}

function generateBubbleContainer(contents: FlexComponent[]): FlexBubble {
  return {
    type: 'bubble',
    body: {
      type: 'box',
      layout: 'vertical',
      contents,
    },
  };
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
    const messageComponents = message.body.map((content) => {
      if (content.type === 'button') {
        const buttonBody = content as ButtonBody;

        return generateButtonComponent(buttonBody.label, buttonBody.text);
      }

      return generateTextComponent(content.text);
    });

    const boxContainer = generateBubbleContainer(messageComponents);

    return generateFlexMessage(boxContainer);
  }
  case 'carousel': {
    const messages = message.body.map((content) => {
      if (content.type === 'button') {
        throw new ServerError('A carousel can only contain text(s)');
      }

      const textComponent = generateTextComponent(content.text);
      return generateBubbleContainer([textComponent]);
    });

    const carouselContainer = generateCarouselContainer(messages);
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
