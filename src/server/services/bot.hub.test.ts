import { Client } from '@line/bot-sdk';
import {
  ServiceMock,
  StateRepositoryMock,
  createNonMessageEvent,
  createUnsavedStateNonExistentServiceEvent,
  createUnsavedStateFinishedStateEvent,
  createUnsavedStateUnfinishedStateEvent,
  createUnsavedStateUserErrorEvent,
  createUnsavedStatePushMessagesEvent,
  createUnsavedStateServerErrorEvent,
  createSavedStateBuggyServiceNameEvent,
  createSavedStateUnfinishedStateEvent,
  createSavedStateFinishedStateEvent,
} from './bot.hub.test.util';
import { BotService } from './bot/base';
import { StateRepository } from './../repository/state';
import { LineBotServiceHub } from './bot.hub';
import { ServerError } from './../utils/error';

jest.mock('@line/bot-sdk', () => ({
  Client: jest.fn().mockImplementation(() => ({
    replyMessage: jest.fn().mockImplementation(() => Promise.resolve()),
    pushMessage: jest.fn().mockImplementation(() => Promise.resolve()),
  })),
}));

describe('Bot hub unit test', () => {
  let client: Client;
  let serviceMock: ServiceMock;
  let stateRepository: StateRepository;
  let hub: LineBotServiceHub;

  beforeAll(() => {
    client = new Client({ channelAccessToken: 'a', channelSecret: 'b' });

    serviceMock = new ServiceMock();
    const serviceMap = new Map<string, BotService>();
    serviceMap.set(serviceMock.identifier, serviceMock);

    stateRepository = new StateRepositoryMock();

    hub = new LineBotServiceHub(client, serviceMap, stateRepository);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('On wrong LINE webhook event', () => {
    it('should resolve with null', async () => {
      const result = await hub.handleBotQuery(createNonMessageEvent());

      expect(result).toBe(null);
    });
  });

  describe('On correct LINE webhook event', () => {
    describe('Message handling tests', () => {
      it(
        'should reply with unidentifiable message when service does not exist',
        async () => {
          const event = createUnsavedStateNonExistentServiceEvent();

          const result = await hub.handleBotQuery(event);

          expect(result).toBe(undefined);
          expect(client.replyMessage).toHaveBeenCalledTimes(1);
        },
      );

      it('should reply correctly', async () => {
        const event = createUnsavedStateFinishedStateEvent();

        const result = await hub.handleBotQuery(event);

        expect(result).toBe(undefined);
        expect(client.replyMessage).toHaveBeenCalledTimes(1);
      });

      it('should push messages', async () => {
        const event = createUnsavedStatePushMessagesEvent();

        const result = await hub.handleBotQuery(event);

        expect(result).toBe(undefined);
        expect(client.pushMessage).toBeCalledTimes(1);
      });

      it('should still reply on user error', async () => {
        const event = createUnsavedStateUserErrorEvent();

        const result = await hub.handleBotQuery(event);

        expect(result).toBe(undefined);
        expect(client.replyMessage).toBeCalledTimes(1);
      });

      it('should throw a server error', () => {
        const event = createUnsavedStateServerErrorEvent();

        expect(hub.handleBotQuery(event)).rejects.toBeInstanceOf(ServerError);
      });
    });

    describe('State handling tests', () => {
      it('should throw a server error caused by wrong service name', () => {
        const event = createSavedStateBuggyServiceNameEvent();

        expect(hub.handleBotQuery(event)).rejects.toBeInstanceOf(ServerError);
      });

      it('should create new user state', async () => {
        jest.spyOn(stateRepository, 'create');

        const event = createUnsavedStateUnfinishedStateEvent();

        const result = await hub.handleBotQuery(event);

        expect(result).toBe(undefined);
        expect(client.replyMessage).toHaveBeenCalledTimes(1);
        expect(stateRepository.create).toHaveBeenCalledTimes(1);
      });

      it('should update user state correctly', async () => {
        jest.spyOn(stateRepository, 'update');

        const event = createSavedStateUnfinishedStateEvent();

        const result = await hub.handleBotQuery(event);

        expect(result).toBe(undefined);
        expect(stateRepository.update).toHaveBeenCalledTimes(1);
        expect(client.replyMessage).toHaveBeenCalledTimes(1);
      });

      it('should delete user state correctly', async () => {
        jest.spyOn(stateRepository, 'delete');

        const event = createSavedStateFinishedStateEvent();

        const result = await hub.handleBotQuery(event);

        expect(result).toBe(undefined);
        expect(stateRepository.delete).toHaveBeenCalledTimes(1);
        expect(client.replyMessage).toHaveBeenCalledTimes(1);
      });
    });
  });
});
