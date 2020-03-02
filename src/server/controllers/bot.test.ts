import { Client } from '@line/bot-sdk';
import { LineBotServiceHub } from './../services/bot';
import { LineBotController } from './bot';
import { StateRepositoryMock } from './../services/test.util';

const sampleEvent = {
  'destination': 'xxxxxxxxxx',
  'events': [
    {
      'replyToken': '0f3779fba3b349968c5d07db31eab56f',
      'type': 'message',
      'mode': 'active',
      'timestamp': 1462629479859,
      'source': {
        'type': 'user',
        'userId': 'U4af4980629...',
      },
      'message': {
        'id': '325708',
        'type': 'text',
        'text': 'Hello, world',
      },
    },
    {
      'replyToken': '8cf9239d56244f4197887e939187e19e',
      'type': 'follow',
      'mode': 'active',
      'timestamp': 1462629479859,
      'source': {
        'type': 'user',
        'userId': 'U4af4980629...',
      },
    },
  ],
};

jest.mock('./../services/bot', () => ({
  LineBotServiceHub: jest.fn().mockImplementation(() => ({
    handleBotQuery: jest.fn().mockImplementation(() => 'works'),
  })),
}));

describe('LINE Controller unit test', () => {
  const baseCtx: any = {
    response: {},
  };

  const client = new Client({ channelAccessToken: 'a', channelSecret: 'b' });
  const serviceMap = new Map();
  const stateRepository = new StateRepositoryMock();

  const serviceHub = new LineBotServiceHub(
    client,
    serviceMap,
    stateRepository,
  );

  const controller = new LineBotController(serviceHub);

  it('should respond with 200', async () => {
    const ctx: any = {
      request: {
        body: sampleEvent,
      },
    };

    Object.assign(ctx, baseCtx);

    await controller.handleRequest(ctx);

    expect(ctx.response.status).toBe(200);
    expect(ctx.response.body.length).toBe(2);
    expect(serviceHub.handleBotQuery).toBeCalledTimes(2);
  });

  it('should respond with 500', async () => {
    const spy = jest.spyOn(serviceHub, 'handleBotQuery');
    const app = {
      emit: jest.fn().mockImplementation(() => null),
    };

    const ctx: any = {
      request: {
        body: sampleEvent,
      },
      app,
    };

    Object.assign(ctx, baseCtx);

    spy.mockImplementationOnce(() => {
      throw new Error();
    });

    await controller.handleRequest(ctx);

    expect(app.emit).toBeCalledTimes(1);
  });
});
