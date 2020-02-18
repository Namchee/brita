import { FlexMessage, Message as LineMessage } from '@line/bot-sdk';
import {
  Message,
  createTextMessage,
  createTextBody,
  createButtonMessage,
  createButtonBody,
  createCarouselMessage,
  createCarouselBody,
} from './messages';
import { formatMessages } from './formatter';
import { ServerError } from '../../../utils/error';

describe('Line message formatter unit test', () => {
  const textMessage: Message = createTextMessage(createTextBody('Text'));
  const buttonsMessage: Message = createButtonMessage([
    createTextBody('Text message'),
    createButtonBody('Label', 'Button message'),
  ]);
  const carouselMessage: Message = createCarouselMessage([
    createCarouselBody('a', 'b'),
  ]);
  const pushMessage = [
    textMessage,
    buttonsMessage,
  ];

  describe('LINE Text message test', () => {
    it('should return a preformatted line text message', () => {
      const message = formatMessages([textMessage]);

      expect(Array.isArray(message)).toBe(false);
    });

    it('should throw a server error when body contains more than 1 element',
      () => {
        const buttonCopy: Message = JSON.parse(JSON.stringify(buttonsMessage));
        buttonCopy.type = 'basic';

        expect(() => formatMessages([buttonCopy])).toThrow(ServerError);
      });
  });

  describe('LINE buttons message test', () => {
    it('should return a preformatted line buttons flex message', () => {
      const message = formatMessages([buttonsMessage]);

      expect(Array.isArray(message)).toBe(false);
      expect((message as FlexMessage).contents.type).toBe('bubble');
    });
  });

  describe('LINE carousel message test', () => {
    it('should return a preformatted carousel message', () => {
      const message = formatMessages([carouselMessage]);

      expect(Array.isArray(message)).toBe(false);
      expect((message as FlexMessage).contents.type).toBe('carousel');
    });

    it('should throw an error when message body type is not "bubble"', () => {
      const carouselCopy: Message = JSON.parse(JSON.stringify(carouselMessage));

      carouselCopy.body.push(createTextBody('hai'));

      expect(() => formatMessages([carouselCopy])).toThrow(ServerError);
    });
  });

  describe('Push message test', () => {
    it('should return a preformatted push messages', () => {
      const messages = formatMessages(pushMessage);

      expect(messages).toBeInstanceOf(Array);

      const lineMessages = messages as LineMessage[];

      expect(lineMessages[0].type).toBe('text');
      expect(lineMessages[1].type).toBe('flex');
      expect((lineMessages[1] as FlexMessage).contents.type).toBe('bubble');
    });
  });
});
