import {
  Message,
  createTextMessage,
  createTextBody,
  createButtonMessage,
  createButtonBody,
  createCarouselMessage,
} from './messages';
import { formatMessages } from './formatter';
import { assert } from 'chai';
import {
  TextMessage,
  FlexMessage,
  CarouselMessage,
  LineMessage,
} from './types';

describe('Line message formatter unit test', () => {
  const textMessage: Message = createTextMessage(createTextBody('Text'));
  const buttonsMessage: Message = createButtonMessage([
    createTextBody('Text message'),
    createButtonBody('Label', 'Button message'),
  ]);
  const carouselMessage: Message = createCarouselMessage([
    textMessage.body[0],
    textMessage.body[0],
  ]);
  const pushMessage = [
    textMessage,
    buttonsMessage,
  ];

  it('should return a preformatted line text message', () => {
    const message = formatMessages([textMessage]);

    assert.instanceOf(message, TextMessage, 'Should return a `TextMessage`');

    const lineMessage = message as LineMessage;

    assert.equal(lineMessage.type, 'text', 'Should return a text type');
  });

  it('should return a preformatted line buttons flex message', () => {
    const message = formatMessages([buttonsMessage]);

    assert.instanceOf(message, FlexMessage, 'Should return a `FlexMessage`');

    const lineMessage = message as LineMessage;

    assert.equal(lineMessage.type, 'flex', 'should return a flex type');
  });

  it('should return a preformatted carousel message', () => {
    const message = formatMessages([carouselMessage]);

    assert.instanceOf(
      message,
      CarouselMessage,
      'should return a `CarouselMessage`',
    );

    const lineMessage = message as LineMessage;

    assert.equal(
      lineMessage.type,
      'carousel',
      'should return a carousel type',
    );
  });

  it('should return a preformatted push messages', () => {
    const messages = formatMessages(pushMessage);

    assert.instanceOf(messages, Array, 'should return an array');

    for (const message of messages as LineMessage[]) {
      assert.instanceOf(message, LineMessage, 'should return a LineMessage');
    }
  });
});
