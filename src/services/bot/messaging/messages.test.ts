import {
  createTextMessage,
  createTextBody,
  createButtonBody,
  createButtonMessage,
  createCarouselMessage,
} from './messages';
import { ServerError } from '../../../utils/error';

describe('Message generator unit test', () => {
  describe('createTextBody', () => {
    it('should create a new text body', () => {
      const textBody = createTextBody('Test text');

      expect(textBody.type).toEqual('text');
      expect(textBody.text).toEqual('Test text');
    });
  });

  describe('createButtonBody', () => {
    it('should create a new button body', () => {
      const buttonBody = createButtonBody('Test label', 'Test text');

      expect(buttonBody.type).toEqual('button');
      expect(buttonBody.label).toEqual('Test label');
      expect(buttonBody.text).toEqual('Test text');
    });

    it('should create a new button body with trimmed label', () => {
      const buttonBody = createButtonBody('Test label Test label', 'Test text');

      expect(buttonBody.type).toEqual('button');
      expect(buttonBody.label).toEqual('Test label Test labe');
      expect(buttonBody.text).toEqual('Test text');
    });
  });

  describe('createTextMessage', () => {
    it('should create a new text message', () => {
      const textBody = createTextBody('Test text');
      const textMessage = createTextMessage(textBody);

      expect(textMessage.type).toEqual('basic');
      expect(textMessage.body.length).toEqual(1);
    });

    it('should throw an error because ilegal body type', () => {
      const buttonBody = createButtonBody('Test label', 'Test text');

      expect(() => createTextMessage(buttonBody)).toThrowError(ServerError);
    });
  });

  describe('createButtonMessage', () => {
    it('should create a new button message', () => {
      const buttonBody = createButtonBody('Test label', 'Test text');
      const buttonMessage = createButtonMessage([buttonBody, buttonBody]);

      expect(buttonMessage.type).toEqual('buttons');
      expect(buttonMessage.body.length).toEqual(2);
    });

    it('should throw an error because there is no button body', () => {
      const textBody = createTextBody('Test text');

      expect(() => createButtonMessage([textBody])).toThrowError(ServerError);
    });
  });

  describe('createCarouselMessage', () => {
    it('should create a new carousel message', () => {
      const textBody = createTextBody('Test text');
      const buttonMessage = createCarouselMessage([textBody, textBody]);

      expect(buttonMessage.type).toEqual('carousel');
      expect(buttonMessage.body.length).toEqual(2);
    });
  });
});
