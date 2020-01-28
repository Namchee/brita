import { ServiceMock, StateRepositoryMock } from './bot.endpoint.test.util';
import Sentry from '@sentry/node';
import sinon from 'sinon';
import { BotService } from '../services/bot/base';
import { BotEndpointHandler } from './line.controller';
import { expect } from 'chai';
import { StateRepository } from '../repository/state';

describe('Bot endpoint unit test', () => {
  let endpoint: BotEndpointHandler;
  let stateRepositoryMock: StateRepository;

  before(() => {
    const serviceMock = new ServiceMock();

    sinon.stub(Sentry);

    const serviceMap = new Map<string, BotService>();
    serviceMap.set(serviceMock.identifier, serviceMock);

    stateRepositoryMock = new StateRepositoryMock();

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
      expect(body.error).to.be.not.null;
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
      expect(body.error).to.be.not.null;
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
      expect(body.error).to.be.not.null;
    });
  });

  describe('On unsaved state', () => {
    it('should return a `not found` message', async () => {
      const event: any = {
        body: `{
          "userId": "2",
          "text": "subscribe"
        }`,
      };

      const t: any = {};

      const result: any = await endpoint.handler(event, t);
      const body = JSON.parse(result.body);

      expect(result.statusCode).to.be.equal(400);
      expect(body.data).to.be.null;
      expect(body.error.type).to.be.equal('text');
    });

    it('should return a preformatted reply message', async () => {
      const spy = sinon.spy(stateRepositoryMock, 'create');

      const event: any = {
        body: `{
          "userId": "2",
          "text": "pengumuman 1"
        }`,
      };

      const t: any = {};

      const result: any = await endpoint.handler(event, t);
      const body: any = JSON.parse(result.body);
      spy.restore();

      expect(result.statusCode).to.be.equal(200);
      expect(body.error).to.be.null;
      expect(body.data).to.be.not.null;
      expect(
        spy.calledOnceWith('2', 'pengumuman', 1, 'pengumuman 1'),
      ).to.be.true;
    });

    it('should return a preformatted error message', async () => {
      const event: any = {
        body: `{
          "userId": "2",
          "text": "pengumuman 3"
        }`,
      };

      const t: any = {};

      const result: any = await endpoint.handler(event, t);
      const body: any = JSON.parse(result.body);

      expect(result.statusCode).to.be.equal(400);
      expect(body.error).to.be.not.null;
      expect(body.data).to.be.null;
    });

    it('should report an error to Sentry', async () => {
      const event: any = {
        body: `{
          "userId": "2",
          "text": "pengumuman 1000"
        }`,
      };

      const t: any = { fail: () => null };
      const spy = sinon.spy(t, 'fail');

      const result: any = await endpoint.handler(event, t);

      expect(result).to.be.undefined;
      expect(spy.calledOnce).to.be.true;

      spy.restore();
    });
  });

  describe('On saved state', () => {
    it('should return a preformatted reply message', async () => {
      const spy = sinon.spy(stateRepositoryMock, 'update');

      const event: any = {
        body: `{
          "userId": "1",
          "text": "pengumuman 1"
        }`,
      };

      const t: any = {};

      const result: any = await endpoint.handler(event, t);
      const body: any = JSON.parse(result.body);
      spy.restore();

      expect(result.statusCode).to.be.equal(200);
      expect(body.error).to.be.null;
      expect(body.data).to.be.not.null;
      expect(
        spy.calledOnceWith(
          { id: '1', service: 'pengumuman', state: 1, text: 'pengumuman 1' },
        ),
      ).to.be.true;
    });

    it('should finish the request with a reply message', async () => {
      const spy = sinon.spy(stateRepositoryMock, 'delete');

      const event: any = {
        body: `{
          "userId": "1",
          "text": "pengumuman 2"
        }`,
      };

      const t: any = {};

      const result: any = await endpoint.handler(event, t);
      const body: any = JSON.parse(result.body);
      spy.restore();

      expect(result.statusCode).to.be.equal(200);
      expect(body.error).to.be.null;
      expect(body.data).to.be.not.null;
      expect(spy.calledOnceWith('1')).to.be.true;
    });

    it('should report an error to Sentry', async () => {
      const event: any = {
        body: `{
          "userId": "11",
          "text": "zzzz"
        }`,
      };

      const t: any = { fail: () => null };
      const spy = sinon.spy(t, 'fail');

      const result: any = await endpoint.handler(event, t);

      expect(result).to.be.undefined;
      expect(spy.calledOnce).to.be.true;

      spy.restore();
    });
  });

  describe('On state update failure', async () => {
    it('should report an error to Sentry', async () => {
      const spy1 = sinon.spy(stateRepositoryMock, 'update');

      const event: any = {
        body: `{
          "userId": "1000",
          "text": "pengumuman 1"
        }`,
      };

      const t: any = { fail: () => null };
      const spy2 = sinon.spy(t, 'fail');

      const result: any = await endpoint.handler(event, t);
      const body: any = JSON.parse(result.body);

      expect(result.statusCode).to.equal(200);
      expect(body.error).to.be.null;
      expect(body.data).to.not.be.null;
      expect(spy1.calledOnceWith({
        id: '1000',
        service: 'pengumuman',
        state: 1,
        text: 'pengumuman 1',
      })).to.be.true;
      expect(spy2.calledOnce).to.be.true;

      spy1.restore();
      spy2.restore();
    });
  });
});
