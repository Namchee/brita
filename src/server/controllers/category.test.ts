import { CategoryService } from './../services/category';
import { CategoryController } from './category';
import { UserError, ServerError } from '../utils/error';

jest.mock('./../services/category', () => ({
  CategoryService: jest.fn().mockImplementation(() => ({
    findAll: jest.fn().mockImplementation(() => []),
    findByName: jest.fn().mockImplementation(() => null),
    create: jest.fn().mockImplementation(() => Promise.resolve({})),
    update: jest.fn().mockImplementation(() => true),
    delete: jest.fn().mockImplementation(() => true),
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

  describe('findAll', () => {
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

    it('should throw a server error when server error occured', async () => {
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

      expect(service.findAll).toBeCalledTimes(1);
      expect(app.emit).toHaveBeenCalledTimes(1);
    });
  });

  describe('findByName', () => {
    it('should respond with 200', async () => {
      jest.spyOn(service, 'findByName');

      const ctx: any = {
        params: {
          name: 'asdasd',
        },
      };

      Object.assign(ctx, baseCtx);

      await controller.findByName(ctx);

      expect(ctx.response.status).toBe(200);
      expect(ctx.response.body.data).toStrictEqual(null);
      expect(ctx.response.body.error).toBeNull;
      expect(service.findByName).toBeCalledTimes(1);
      expect(service.findByName).toBeCalledWith('asdasd');
    });

    it('should respond with an error when user error occured', async () => {
      const spy = jest.spyOn(service, 'findByName');

      spy.mockImplementation(() => {
        throw new UserError('');
      });

      const ctx: any = {
        params: {
          name: 'asda',
        },
      };

      Object.assign(ctx, baseCtx);

      await controller.findByName(ctx);

      expect(ctx.response.status).toBe(400);
      expect(ctx.response.body.data).toBeNull;
      expect(ctx.response.body.error).toBe('');
    });

    it('should throw a server error when server error occured', async () => {
      const spy = jest.spyOn(service, 'findByName');

      spy.mockImplementation(() => {
        throw new ServerError('');
      });

      const app = {
        emit: jest.fn().mockImplementation(() => null),
      };

      const ctx: any = {
        params: {
          name: 'asda',
        },
        app,
      };

      Object.assign(ctx, baseCtx);

      await controller.findByName(ctx);

      expect(app.emit).toHaveBeenCalledTimes(1);
    });
  });

  describe('create', () => {
    it('should respond with 201', async () => {
      jest.spyOn(service, 'create');

      const ctx: any = {
        request: {
          body: {},
        },
      };

      Object.assign(ctx, baseCtx);

      await controller.create(ctx);

      expect(ctx.response.status).toBe(201);
      expect(ctx.response.body.data).toStrictEqual({});
      expect(ctx.response.body.error).toBeNull;
      expect(service.create).toBeCalledTimes(1);
      expect(service.create).toBeCalledWith({});
    });

    it('should respond with an error when user error occured', async () => {
      const spy = jest.spyOn(service, 'create');

      spy.mockImplementation(() => {
        throw new UserError('');
      });

      const ctx: any = {
        request: {
          body: {},
        },
      };

      Object.assign(ctx, baseCtx);

      await controller.create(ctx);

      expect(ctx.response.status).toBe(400);
      expect(ctx.response.body.data).toBeNull;
      expect(ctx.response.body.error).toBe('');
    });

    it('should throw a server error when server error occured', async () => {
      const spy = jest.spyOn(service, 'create');

      spy.mockImplementation(() => {
        throw new ServerError('');
      });

      const app = {
        emit: jest.fn().mockImplementation(() => null),
      };

      const ctx: any = {
        request: {
          body: {},
        },
        app,
      };

      Object.assign(ctx, baseCtx);

      await controller.create(ctx);

      expect(app.emit).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('should respond with 204', async () => {
      jest.spyOn(service, 'update');

      const ctx: any = {
        params: {
          id: '123',
        },
        request: {
          body: {},
        },
      };

      Object.assign(ctx, baseCtx);

      await controller.update(ctx);

      expect(ctx.response.status).toBe(204);
      expect(ctx.response.body).toBeNull;
      expect(service.update).toBeCalledTimes(1);
      expect(service.update).toBeCalledWith({ id: ctx.params.id });
    });

    it('should respond with 404 when entity is not found', async () => {
      const spy = jest.spyOn(service, 'update');

      spy.mockImplementation(() => Promise.resolve(false));

      const ctx: any = {
        params: {
          id: '123',
        },
        request: {
          body: {},
        },
      };

      Object.assign(ctx, baseCtx);

      await controller.update(ctx);

      expect(ctx.response.status).toBe(404);
      expect(ctx.response.body).toBeNull;
      expect(service.update).toBeCalledTimes(1);
      expect(service.update).toBeCalledWith({ id: ctx.params.id });
    });

    it('should respond with an error when user error occured', async () => {
      const spy = jest.spyOn(service, 'update');

      spy.mockImplementation(() => {
        throw new UserError('');
      });

      const ctx: any = {
        params: {
          id: '123',
        },
        request: {
          body: {},
        },
      };

      Object.assign(ctx, baseCtx);

      await controller.update(ctx);

      expect(ctx.response.status).toBe(400);
      expect(ctx.response.body.data).toBeNull;
      expect(ctx.response.body.error).toBe('');
    });

    it('should throw a server error when server error occured', async () => {
      const spy = jest.spyOn(service, 'update');

      spy.mockImplementation(() => {
        throw new ServerError('');
      });

      const app = {
        emit: jest.fn().mockImplementation(() => null),
      };

      const ctx: any = {
        request: {
          body: {},
        },
        app,
      };

      Object.assign(ctx, baseCtx);

      await controller.update(ctx);

      expect(app.emit).toHaveBeenCalledTimes(1);
    });
  });

  describe('delete', () => {
    it(
      'should respond with 204 when deletion performed successfully',
      async () => {
        jest.spyOn(service, 'delete');

        const ctx: any = {
          params: {
            id: 'asd',
          },
        };

        Object.assign(ctx, baseCtx);

        await controller.delete(ctx);

        expect(ctx.response.status).toBe(204);
        expect(ctx.response.body).toBeNull;
        expect(service.delete).toBeCalledTimes(1);
        expect(service.delete).toBeCalledWith(ctx.params.id);
      });

    it('should respond with 404 when the entity is not found', async () => {
      const spy = jest.spyOn(service, 'delete');

      spy.mockImplementation(() => Promise.resolve(false));

      const ctx: any = {
        params: {
          id: 'asd',
        },
      };

      Object.assign(ctx, baseCtx);

      await controller.delete(ctx);

      expect(ctx.response.status).toBe(404);
      expect(ctx.response.body).toBeNull;
      expect(service.delete).toBeCalledTimes(1);
      expect(service.delete).toBeCalledWith(ctx.params.id);
    });

    it('should respond with an error when user error occured', async () => {
      const spy = jest.spyOn(service, 'delete');

      spy.mockImplementation(() => {
        throw new UserError('');
      });

      const ctx: any = {
        params: {
          id: 'asd',
        },
      };

      Object.assign(ctx, baseCtx);

      await controller.delete(ctx);

      expect(ctx.response.status).toBe(400);
      expect(ctx.response.body.data).toBeNull;
      expect(ctx.response.body.error).toBe('');
    });

    it('should throw a server error when server error occured', async () => {
      const spy = jest.spyOn(service, 'delete');

      spy.mockImplementation(() => {
        throw new ServerError('');
      });

      const app = {
        emit: jest.fn().mockImplementation(() => null),
      };

      const ctx: any = {
        params: {
          id: 'asd',
        },
        app,
      };

      Object.assign(ctx, baseCtx);

      await controller.delete(ctx);

      expect(app.emit).toHaveBeenCalledTimes(1);
    });
  });
});
