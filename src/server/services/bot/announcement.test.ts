import { BotAnnouncementService } from './announcement';
import { ServerError } from './../../utils/error';
import {
  AnnouncementRepositoryMock,
  CategoryRepositoryMock,
  categories,
  announcements,
} from './announcement.test.util';
import { CategoryRepository } from './../../repository/category';
import { AnnouncementRepository } from './../../repository/announcement';
import { StringMap } from '../../utils/types';
import { CarouselBody } from './messaging/messages';

describe('Bot service unit test', () => {
  describe('Announcement service test', () => {
    let announcementRepository: AnnouncementRepository;
    let categoryRepository: CategoryRepository;
    let botService: BotAnnouncementService;

    beforeAll(() => {
      announcementRepository = new AnnouncementRepositoryMock();

      categoryRepository = new CategoryRepositoryMock();

      botService = new BotAnnouncementService(
        announcementRepository,
        categoryRepository,
      );
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should throw a server error when state is negative', () => {
      const serviceParams = {
        state: -1,
        text: '',
      };

      expect(botService.handle(serviceParams))
        .rejects
        .toBeInstanceOf(ServerError);
    });

    describe('First handler testing', () => {
      it('should throw a server error when command mapping is wrong', () => {
        const serviceParams = {
          state: 0,
          text: 'subscribe',
        };

        expect(botService.handle(serviceParams))
          .rejects
          .toBeInstanceOf(ServerError);
      });

      it('should return when text message when no category is available',
        async () => {
          jest.spyOn(categoryRepository, 'findAll')
            .mockImplementationOnce(() => Promise.resolve([]));

          const serviceParams = {
            state: 0,
            text: 'pengumuman',
          };

          const result = await botService.handle(serviceParams);

          expect(result.state).toBe(0);
          expect(result.message.length).toBe(1);
          expect(result.message[0].type).toBe('basic');
        });

      it('should return list of categories when categories is available',
        async () => {
          const spy = jest.spyOn(categoryRepository, 'findAll');

          const serviceParams = {
            state: 0,
            text: 'pengumuman',
          };

          const result = await botService.handle(serviceParams);

          expect(result.state).toBe(1);
          expect(result.message.length).toBe(1);
          expect(result.message[0].type).toBe('buttons');
          expect(spy.mock.calls.length).toBe(1);
        });
    });

    describe('Second handler testing', () => {
      it('should throw a user error when category is not found', async () => {
        const serviceParams = {
          state: 1,
          text: 'pengumuman Three',
        };

        const result = await botService.handle(serviceParams);

        expect(result.state).toBe(-2);
        expect(result.message.length).toBe(1);
        expect(result.message[0].type).toBe('basic');
      });

      it('should request an amount of categories requested', async () => {
        const spy = jest.spyOn(categoryRepository, 'findByName');

        const serviceParams = {
          state: 1,
          text: 'pengumuman One',
        };

        const result = await botService.handle(serviceParams);

        expect(result.state).toBe(2);
        expect(result.message.length).toBe(1);
        expect(result.message[0].type).toBe('basic');
        expect(spy.mock.calls.length).toBe(1);
      });
    });

    describe('Third handler testing', () => {
      let misc: StringMap;

      beforeAll(() => {
        misc = new Map();
        misc['category'] = categories[0];
      });

      it('should throw a server error when cache is not available',
        async () => {
          const serviceParams = {
            state: 2,
            text: 'pengumuman Three 10',
          };

          expect(botService.handle(serviceParams))
            .rejects
            .toBeInstanceOf(ServerError);
        });

      it(
        'should throw a user error when inputted amount is not a number',
        async () => {
          const serviceParams = {
            state: 2,
            text: 'pengumuman One Numberrr',
            misc,
          };

          const result = await botService.handle(serviceParams);

          expect(result.state).toBe(-2);
          expect(result.message.length).toBe(1);
        },
      );

      it('should throw a user error when the requested amount is too much',
        async () => {
          const serviceParams = {
            state: 2,
            text: 'pengumuman One 11',
            misc,
          };

          const result = await botService.handle(serviceParams);

          expect(result.state).toBe(-2);
          expect(result.message.length).toBe(1);
        },
      );

      it('should throw a user error when the requested amount is below 1',
        async () => {
          const serviceParams = {
            state: 2,
            text: 'pengumuman One -1',
            misc,
          };

          const result = await botService.handle(serviceParams);

          expect(result.state).toBe(-2);
          expect(result.message.length).toBe(1);
        },
      );

      it('should return list of all announcements', async () => {
        const serviceParams = {
          state: 2,
          text: 'pengumuman One 3',
          misc,
        };

        const result = await botService.handle(serviceParams);

        expect(result.state).toBe(0);

        const announcementText = result.message[1].body;

        expect(announcementText.length).toBe(3);

        for (let i = 0; i < announcementText.length; i++) {
          expect(announcementText[i].type).toBe('bubble');
        }
      });

      it('should return list of partial announcements', async () => {
        const serviceParams = {
          state: 2,
          text: 'pengumuman One 2',
          misc: misc,
        };

        const result = await botService.handle(serviceParams);

        expect(result.state).toBe(0);

        const announcementText = result.message[1].body as CarouselBody[];

        expect(announcementText.length).toBe(2);

        for (let i = 0; i < announcementText.length; i++) {
          expect(announcementText[i].type).toBe('bubble');
          expect(announcementText[i].header).toBe(announcements[i].title);
          expect(announcementText[i].text).toBe(announcements[i].content);
        }
      });
    });

    // need a better name for this
    describe('Multiple parameter from zero state testing', () => {
      it('should return push message error', async () => {
        const serviceParams = {
          state: 0,
          text: 'pengumuman Three',
        };

        const result = await botService.handle(serviceParams);

        expect(result.state).toBe(1);

        expect(result.message.length).toBe(2);
        expect(result.message[0].type).toBe('basic');
      });

      it('should handle the state until it reached second state', async () => {
        const serviceParams = {
          state: 0,
          text: 'pengumuman One',
        };

        const result = await botService.handle(serviceParams);

        expect(result.state).toBe(2);
        expect(result.message.length).toBe(1);
        expect(result.misc).toBeDefined();
      });

      it('should handle the state until it finished the request', async () => {
        const serviceParams = {
          state: 0,
          text: 'pengumuman One 2',
        };

        const result = await botService.handle(serviceParams);

        expect(result.state).toBe(0);

        const announcementText = result.message[1].body as CarouselBody[];

        expect(announcementText.length).toBe(2);

        for (let i = 0; i < announcementText.length; i++) {
          expect(announcementText[i].type).toBe('bubble');
          expect(announcementText[i].header).toBe(announcements[i].title);
          expect(announcementText[i].text).toBe(announcements[i].content);
        }
      });
    });

    describe('Multiple parameters from non-zero state testing', () => {
      it('should handle the state until it finished the request', async () => {
        const serviceParams = {
          state: 1,
          text: 'pengumuman One 2',
        };

        const result = await botService.handle(serviceParams);

        expect(result.state).toBe(0);

        const announcementText = result.message[1].body as CarouselBody[];

        expect(announcementText.length).toBe(2);

        for (let i = 0; i < announcementText.length; i++) {
          expect(announcementText[i].type).toBe('bubble');
          expect(announcementText[i].header).toBe(announcements[i].title);
          expect(announcementText[i].text).toBe(announcements[i].content);
        }
      });
    });
  });
});
