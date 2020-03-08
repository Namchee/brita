import { AnnouncementService } from './../services/announcement';
import { AnnouncementController } from './announcement';
import { UserError, ServerError } from '../utils/error';

jest.mock('./../services/announcement', () => ({
  AnnouncementService: jest.fn().mockImplementation(() => ({
    find: jest.fn().mockImplementation(() => []),
  })),
}));

describe('Announcement REST controller unit test', () => {
  // to fix silly ts bug
  const baseCtx: any = {
    response: {},
  };

  const service = new AnnouncementService({} as any);
  const controller = new AnnouncementController(service);

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET findAll', () => {
    it('should respond with 200', async () => {
      jest.spyOn(service, 'find');

      const ctx: any = {
        request: {
          query: {},
        },
      };

      Object.assign(ctx, baseCtx);

      await controller.find(ctx);

      expect(ctx.response.status).toBe(200);
      expect(ctx.response.body.data).toStrictEqual([]);
      expect(ctx.response.body.error).toBeNull;
      expect(service.find).toHaveBeenCalledTimes(1);
    });

    it('should accept query parameters and pass it correctly', async () => {
      const ctx: any = {
        request: {
          query: {
            limit: 1,
            offset: 1,
          },
        },
      };

      Object.assign(ctx, baseCtx);

      await controller.find(ctx);

      expect(ctx.response.status).toBe(200);
      expect(ctx.response.body.data).toStrictEqual([]);
      expect(ctx.response.body.error).toBeNull;
      expect(service.find).toHaveBeenCalledTimes(1);
      expect(service.find).toHaveBeenCalledWith(ctx.request.query);
    });

    it('should respond with an error when user error occured', async () => {
      const spy = jest.spyOn(service, 'find');

      spy.mockImplementation(() => {
        throw new UserError('');
      });

      const ctx: any = {
        request: {
          query: {},
        },
      };

      Object.assign(ctx, baseCtx);

      await controller.find(ctx);

      expect(ctx.response.status).toBe(400);
      expect(ctx.response.body.data).toBeNull;
      expect(ctx.response.body.error).toBe('');
    });

    it(
      'should respond with server error when server error occurs',
      async () => {
        const spy = jest.spyOn(service, 'find');

        spy.mockImplementation(() => {
          throw new ServerError('');
        });

        const app = {
          emit: jest.fn().mockImplementation(() => null),
        };

        const ctx: any = {
          request: {
            query: {},
          },
          app,
        };

        Object.assign(ctx, baseCtx);

        await controller.find(ctx);

        expect(app.emit).toHaveBeenCalledTimes(1);
      });
  });
});
