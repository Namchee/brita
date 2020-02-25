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
  QuickReplyItem,
} from '@line/bot-sdk';
import { Message, ButtonBody, CarouselBody, QuickReplyItems } from './messages';
import { ServerError } from './../../../utils/error';

function generateQuickReplyObject(item: QuickReplyItems): QuickReplyItem {
  return {
    type: 'action',
    action: {
      type: 'message',
      label: item.label,
      text: item.text,
    },
  };
}

function generateLineTextMessage(text: string): TextMessage {
  return {
    type: 'text',
    text,
  };
}

function generateTextComponent(
  text: string,
  size?: 'sm' | 'md' | 'lg',
  bold?: boolean,
  center?: boolean,
): FlexText {
  const textObject = generateLineTextMessage(text);

  return {
    size: size || 'sm',
    ...textObject,
    wrap: true,
    weight: bold ? 'bold' : 'regular',
    align: center ? 'center' : 'start',
  };
}

function generateButtonComponent(
  label: string,
  text: string,
): FlexButton {
  return {
    type: 'button',
    action: {
      type: 'message',
      text,
      label,
    },
    height: 'sm',
  };
}

function generateBubbleContainer(
  body: FlexComponent[],
  header?: FlexComponent,
  tightPadding?: boolean,
  smallSize?: boolean,
): FlexBubble {
  const bubble: FlexBubble = {
    type: 'bubble',
    size: smallSize ? 'kilo' : 'mega',
    body: {
      type: 'box',
      layout: 'vertical',
      paddingAll: tightPadding ? 'lg' : undefined,
      contents: body,
    },
  };

  if (header) {
    bubble.header = {
      type: 'box',
      layout: 'vertical',
      paddingAll: tightPadding ? 'lg' : undefined,
      contents: [header],
    };
  }

  return bubble;
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
      const components = message.body.map((component) => {
        if (component.type === 'button') {
          const buttonComponent = component as ButtonBody;

          return generateButtonComponent(
            buttonComponent.label,
            buttonComponent.text,
          );
        }

        return [
          generateTextComponent(component.text, 'sm'),
          {
            type: 'separator',
            margin: 'lg',
          },
        ];
      });

      const boxContainer = generateBubbleContainer(
        components.flat(),
        undefined,
        true,
        true,
      );

      return generateFlexMessage(boxContainer);
    }
    case 'carousel': {
      const bubbles = message.body as CarouselBody[];

      const components = bubbles.map((component) => {
        const body = generateTextComponent(component.text);

        const header = component.header ?
          generateTextComponent(component.header, 'lg', true, true) :
          undefined;

        return generateBubbleContainer([body], header, true);
      });

      const carouselContainer = generateCarouselContainer(components);
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
    const lineMessage = generateLineMessage(messages[0]);

    if (messages[0].quickReply) {
      lineMessage['quickReply'] = {
        items: messages[0].quickReply.map(
          reply => generateQuickReplyObject(reply),
        ),
      };
    }

    return lineMessage;
  } else {
    return messages.map((message) => {
      const lineMessage = generateLineMessage(message);

      if (message.quickReply) {
        lineMessage['quickReply'] = {
          items: message.quickReply.map(
            reply => generateQuickReplyObject(reply),
          ),
        };
      }

      return lineMessage;
    });
  }
}
