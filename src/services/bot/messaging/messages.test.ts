import {
  createTextMessage,
  createTextBody,
  createButtonBody,
  createButtonMessage,
  createCarouselMessage,
} from './messages';
import { expect } from 'chai';
import { ServerError } from '../../../utils/error';

describe('Message generator unit test', () => {
  describe('createTextBody', () => {
    it('should create a new text body', () => {
      const textBody = createTextBody('Test text');

      expect(textBody.type).to.equal('text');
      expect(textBody.text).to.equal('Test text');
    });
  });

  describe('createButtonBody', () => {
    it('should create a new button body', () => {
      const buttonBody = createButtonBody('Test label', 'Test text');

      expect(buttonBody.type).to.equal('button');
      expect(buttonBody.label).to.equal('Test label');
      expect(buttonBody.text).to.equal('Test text');
    });

    it('should create a new button body with trimmed label', () => {
      const buttonBody = createButtonBody('Test label Test label', 'Test text');

      expect(buttonBody.type).to.equal('button');
      expect(buttonBody.label).to.equal('Test label Test labe');
      expect(buttonBody.text).to.equal('Test text');
    });
  });

  describe('createTextMessage', () => {
    it('should create a new text message', () => {
      const textBody = createTextBody('Test text');
      const textMessage = createTextMessage(textBody);

      expect(textMessage.type).to.equal('basic');
      expect(textMessage.body.length).to.equal(1);
    });

    it('should throw an error because ilegal body type', () => {
      const buttonBody = createButtonBody('Test label', 'Test text');

      expect(() => createTextMessage(buttonBody)).to.throw(ServerError);
    });
  });

  describe('createButtonMessage', () => {
    it('should create a new button message', () => {
      const buttonBody = createButtonBody('Test label', 'Test text');
      const buttonMessage = createButtonMessage([buttonBody, buttonBody]);

      expect(buttonMessage.type).to.equal('buttons');
      expect(buttonMessage.body.length).to.equal(2);
    });

    it('should throw an error because there is no button body', () => {
      const textBody = createTextBody('Test text');

      expect(() => createButtonMessage([textBody])).to.throw(ServerError);
    });
  });

  describe('createCarouselMessage', () => {
    it('should create a new carousel message', () => {
      const textBody = createTextBody('Test text');
      const buttonMessage = createCarouselMessage([textBody, textBody]);

      expect(buttonMessage.type).to.equal('carousel');
      expect(buttonMessage.body.length).to.equal(2);
    });
  });
});
