import { BotAnnouncementService } from './announcement';
import {
  AnnouncementRepositoryMock,
  CategoryRepositoryMock,
  categories,
} from './../test.util';
import { BotServiceParameters } from './base';
import { FlexMessage, FlexCarousel } from '@line/bot-sdk';

describe('Bot announcement service unit test', () => {
  const categoryRepository = new CategoryRepositoryMock();
  const announcementRepository = new AnnouncementRepositoryMock();
  const service = new BotAnnouncementService(
    announcementRepository,
    categoryRepository,
  );

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('First handler test', () => {
    const params: BotServiceParameters = {
      state: 0,
      text: 'pengumuman',
      timestamp: 1,
      misc: {},
    };

    it('should reply with text message when categories exists', async () => {
      jest.spyOn(categoryRepository, 'findAll');

      const result = await service.handle(params);

      expect(categoryRepository.findAll).toHaveBeenCalledTimes(1);
      expect(result.state).toBe(1);
      expect(result.misc).toBeUndefined();
      expect(result.message.length).toBe(1);

      const actualMessage = result.message[0];

      expect(actualMessage.type).toBe('text');
      expect(actualMessage.quickReply).toBeDefined();
      expect(actualMessage.quickReply?.items).toBeDefined();
      expect(actualMessage.quickReply?.items.length).toBe(3);
    });

    it('should return empty notice when categories is empty', async () => {
      const spy = jest.spyOn(categoryRepository, 'findAll');

      spy.mockImplementation(() => Promise.resolve([]));

      const result = await service.handle(params);

      expect(categoryRepository.findAll).toHaveBeenCalledTimes(1);
      expect(result.state).toBe(0);
      expect(result.misc).toBeUndefined();
      expect(result.message.length).toBe(1);

      const actualMessage = result.message[0];

      expect(actualMessage.type).toBe('text');
      expect(actualMessage.quickReply).toBeUndefined();

      spy.mockRestore();
    });
  });

  describe('Second handler test', () => {
    describe('When cache has not been set', () => {
      it('should return carousel when category is found', async () => {
        const params: BotServiceParameters = {
          state: 1,
          text: categories[0].name,
          timestamp: 1,
        };

        const result = await service.handle(params);

        expect(result.misc).toBeDefined();
        expect(result.misc?.page).toBe(2);
        expect(result.misc?.category.id).toBe(categories[0].id);
        expect(result.state).toBe(1);
        expect(result.message.length).toBe(3);
        expect(result.message[0].type).toBe('text');
        expect(result.message[1].type).toBe('flex');
        expect(result.message[2].type).toBe('text');

        const flexContainer = result.message[1] as FlexMessage;

        expect(flexContainer.contents.type).toBe('carousel');

        const carousel = flexContainer.contents as FlexCarousel;

        expect(carousel.contents.length).toBe(10);
        expect(result.message[2].quickReply).toBeDefined();
      });

      it('should re-ask category when category is not found', async () => {
        const params: BotServiceParameters = {
          state: 1,
          text: categories[1].name,
          timestamp: 1,
        };

        const result = await service.handle(params);

        expect(result.state).toBe(1);
        expect(result.message.length).toBe(2);
        expect(result.misc).toBeUndefined();

        expect(result.message[0].type).toBe('text');
        expect(result.message[1].type).toBe('text');
        expect(result.message[1].quickReply).toBeDefined();
        expect(result.message[1].quickReply?.items).toBeDefined();
        expect(result.message[1].quickReply?.items.length).toBe(3);
      });
    });

    describe('When cache has been set', () => {
      it('should end the request when user ends the request', async () => {
        const params = {
          state: 1,
          text: 'akhiri',
          timestamp: 1,
          misc: { 'set': '' },
        };

        const result = await service.handle(params);

        expect(result.state).toBe(0);
        expect(result.message.length).toBe(1);
        expect(result.message[0].type).toBe('text');
      });

      it(
        'should rechoose category when user choose to reselect categories',
        async () => {
          const params = {
            state: 1,
            text: 'ganti',
            timestamp: 1,
            misc: { 'set': '' },
          };

          const result = await service.handle(params);

          expect(result.state).toBe(1);
          expect(result.misc).toBeUndefined();
          expect(result.message.length).toBe(1);
          expect(result.message[0].type).toBe('text');
          expect(result.message[0].quickReply).toBeDefined();
        });

      it(
        'should throw an error message when commands is unrecognized',
        async () => {
          const params = {
            state: 1,
            text: 'unrecognized',
            timestamp: 1,
            misc: { 'set': '' },
          };

          const result = await service.handle(params);

          expect(result.state).toBe(1);
          expect(result.message.length).toBe(2);
          expect(result.message[0].type).toBe('text');
          expect(result.message[0].quickReply).toBeUndefined();
          expect(result.message[1].type).toBe('text');
          expect(result.message[1].quickReply).toBeDefined();
          expect(result.misc).toBeDefined();
        });

      it(
        'should return next set of announcement when user want to continue',
        async () => {
          const params = {
            state: 1,
            text: 'lanjutkan',
            timestamp: 1,
            misc: {
              'category':
              {
                id: categories[0].id,
              },
              'page': 2,
            },
          };

          const result = await service.handle(params);

          expect(result.misc).toBeDefined();
          expect(result.misc?.page).toBe(3);
          expect(result.misc?.category.id).toBe(categories[0].id);
          expect(result.state).toBe(1);
          expect(result.message.length).toBe(3);
          expect(result.message[0].type).toBe('text');
          expect(result.message[1].type).toBe('flex');
          expect(result.message[2].type).toBe('text');

          const flexContainer = result.message[1] as FlexMessage;

          expect(flexContainer.contents.type).toBe('carousel');

          const carousel = flexContainer.contents as FlexCarousel;

          expect(carousel.contents.length).toBe(1);
          expect(result.message[2].quickReply).toBeDefined();
        });

      it(
        'should return empty message when no more announcements is available',
        async () => {
          const params = {
            state: 1,
            text: 'lanjutkan',
            timestamp: 1,
            misc: {
              'category':
              {
                id: categories[0].id,
              },
              'page': 3,
            },
          };

          const result = await service.handle(params);

          expect(result.misc).toBeUndefined();
          expect(result.state).toBe(1);
          expect(result.message.length).toBe(2);
          expect(result.message[0].type).toBe('text');
          expect(result.message[1].type).toBe('text');

          expect(result.message[1].quickReply).toBeDefined();
        });
    });
  });
});
