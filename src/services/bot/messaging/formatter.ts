import { Message, ButtonBody } from './messages';
import {
  LineMessage,
  TextMessage,
  LineMessageComponent,
  TextMessageComponent,
  LineAction,
  ButtonMessageComponent,
  BoxContainer,
  BubbleMessage,
  FlexMessage,
  CarouselMessage,
} from './types';
import { ServerError } from '../../../utils/error';

function generateLineMessage(
  message: Message,
): LineMessage {
  switch (message.type) {
  case 'basic': {
    if (message.body.length > 1) {
      throw new ServerError('A basic message can only contain 1 body');
    }

    return new TextMessage(message.body[0].text);
  }
  case 'buttons': {
    const messageComponents: LineMessageComponent[] = [];

    for (const content of message.body) {
      if (content.type === 'text') {
        messageComponents.push(new TextMessageComponent(content.text));
      } else if (content.type === 'button') {
        const contentBody = content as ButtonBody;

        const action = new LineAction(contentBody.label, content.text);
        const buttonComponent = new ButtonMessageComponent(action);

        messageComponents.push(buttonComponent);
      }
    }

    const boxContainer = new BoxContainer(messageComponents);
    const bubbleMessage = new BubbleMessage(boxContainer);

    return new FlexMessage(bubbleMessage);
  }
  case 'carousel': {
    const messages: BubbleMessage[] = [];

    for (const content of message.body) {
      const boxContainer = new BoxContainer(
        [new TextMessageComponent(content.text)],
      );

      messages.push(new BubbleMessage(boxContainer));
    }

    return new CarouselMessage(messages);
  }
  default:
    throw new ServerError('Illegal message type', 500);
  }
}

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
