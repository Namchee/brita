import { CategoryService } from './../services/category';
import { CategoryController } from './category';
import { UserError, ServerError } from '../utils/error';

jest.mock('./../services/category', () => ({
  CategoryService: jest.fn().mockImplementation(() => ({
    findAll: jest.fn().mockImplementation(() => []),
  })),
}));

describe('Category REST controller unit test', () => {
  // to fix silly ts bug
  const baseCtx: any = {
    response: {},
  };

  const service = new CategoryService({} as any);
  const controller = new CategoryController(service);

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET findAll', () => {
    it('should respond with 200', async () => {
      jest.spyOn(service, 'findAll');

      const ctx: any = {
        request: {
          query: {},
        },
      };

      Object.assign(ctx, baseCtx);

      await controller.findAll(ctx);

      expect(ctx.response.status).toBe(200);
      expect(ctx.response.body.data).toStrictEqual([]);
      expect(ctx.response.body.error).toBeNull;
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });

    it('should accept query parameters and pass it correctly', async () => {
      const query = {
        limit: 1,
        offset: 1,
      };

      const ctx: any = {
        request: {
          query,
        },
      };

      Object.assign(ctx, baseCtx);

      await controller.findAll(ctx);

      expect(ctx.response.status).toBe(200);
      expect(ctx.response.body.data).toStrictEqual([]);
      expect(ctx.response.body.error).toBeNull;
      expect(service.findAll).toHaveBeenCalledTimes(1);
      expect(service.findAll).toHaveBeenCalledWith(query);
    });

    it('should respond with an error when user error occured', async () => {
      const spy = jest.spyOn(service, 'findAll');

      spy.mockImplementation(() => {
        throw new UserError('');
      });

      const ctx: any = {
        request: {
          query: {},
        },
      };

      Object.assign(ctx, baseCtx);

      await controller.findAll(ctx);

      expect(ctx.response.status).toBe(400);
      expect(ctx.response.body.data).toBeNull;
      expect(ctx.response.body.error).toBe('');
    });

    it(
      'should respond with server error when server error occurs',
      async () => {
        const spy = jest.spyOn(service, 'findAll');

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

        await controller.findAll(ctx);

        expect(app.emit).toHaveBeenCalledTimes(1);
      });
  });
});
