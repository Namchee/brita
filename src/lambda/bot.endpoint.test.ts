import { ServiceMock, StateRepositoryMock } from './bot.endpoint.test.util';
import Sentry from '@sentry/node';
import sinon from 'sinon';
import { BotService } from '../services/bot/base';
import { BotEndpointHandler } from './bot.endpoint';
import { expect } from 'chai';

describe('Bot endpoint unit test', () => {
  let endpoint: BotEndpointHandler;

  before(() => {
    const serviceMock = new ServiceMock();

    sinon.stub(Sentry);

    const serviceMap = new Map<string, BotService>();
    serviceMap.set(serviceMock.identifier, serviceMock);

    const stateRepositoryMock = new StateRepositoryMock();

    endpoint = new BotEndpointHandler(serviceMap, stateRepositoryMock);
  });

  after(() => {
    sinon.restore();
  });

  describe('On empty request body', () => {
    it('should return status code 400', async () => {
      const event: any = {
        body: '{}',
      };

      const t: any = {};

      const result: any = await endpoint.handler(event, t);
      const body: any = JSON.parse(result.body);

      expect(result.statusCode).to.be.equal(400);
      expect(body.data).to.be.null;
      expect(body.error).to.be.equal('Invalid request body format');
    });
  });

  describe('On wrongly formatted request body', () => {
    it('with unknown properties, should return status code 400', async () => {
      const event: any = {
        body: '{ "awokawokqawokqwok": 1 }',
      };

      const t: any = {};

      const result: any = await endpoint.handler(event, t);
      const body: any = JSON.parse(result.body);

      expect(result.statusCode).to.be.equal(400);
      expect(body.data).to.be.null;
      expect(body.error).to.be.equal('Invalid request body format');
    });

    it('with extraneous property, should return status code 400', async () => {
      const event: any = {
        body: `{ "userId": "1", "text": "ganteng", "awokawokqawokqwok": 1 }`,
      };

      const t: any = {};

      const result: any = await endpoint.handler(event, t);
      const body: any = JSON.parse(result.body);

      expect(result.statusCode).to.be.equal(400);
      expect(body.data).to.be.null;
      expect(body.error).to.be.equal('Invalid request body format');
    });
  });

  describe('On unsaved state', () => {
    
  });
});
