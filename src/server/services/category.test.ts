import { CategoryService } from './category';
import { CategoryRepositoryMock, categories } from './test.util';
import { UserError } from '../utils/error';

describe('Category REST service unit test', () => {
  const repository = new CategoryRepositoryMock();
  const service = new CategoryService(repository);

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    beforeEach(() => {
      jest.spyOn(repository, 'findAll');
      jest.spyOn(repository, 'findByName');
    });

    it('should return all categories', async () => {
      const result = await service.findAll({});

      expect(result).toStrictEqual(categories);
      expect(repository.findAll).toHaveBeenCalledTimes(1);
    });

    it(
      'should return categories subset when supplied with parameters',
      async () => {
        const params: any = {
          limit: 1,
          start: 1,
        };

        const result = await service.findAll(params);

        expect(result).toStrictEqual(categories.slice(1, 2));
        expect(repository.findAll).toHaveBeenCalledTimes(1);
        expect(repository.findAll).toHaveBeenCalledWith(params);
      });

    it(
      'should throw an error when supplied with wrong parameters',
      async () => {
        const params: any = {
          limit: 'a string lol',
          start: 1,
        };

        expect(service.findAll(params)).rejects.toBeInstanceOf(UserError);
        expect(repository.findAll).toHaveBeenCalledTimes(0);
      });
  });

  describe('findByName', () => {
    it('should return a category when category name exists', async () => {
      const result = await service.findByName(categories[0].name);

      expect(result).toStrictEqual(categories[0]);
      expect(repository.findByName).toBeCalledTimes(1);
      expect(repository.findByName).toHaveBeenCalledWith(categories[0].name);
    });

    it('should return null when category name does not exist', async () => {
      const result = await service.findByName('asd');

      expect(result).toBeNull;
      expect(repository.findByName).toBeCalledTimes(1);
      expect(repository.findByName).toHaveBeenCalledWith('asd');
    });
  });

  describe('create', () => {
    let spy: jest.SpyInstance;

    beforeEach(() => {
      spy = jest.spyOn(repository, 'create');
    });

    it('should create a new category entity', async () => {
      const category = {
        name: 'boom boom',
        desc: 'boom shakalaka',
      };

      const result = await service.create(category);

      expect(result).toStrictEqual({});
      expect(repository.create).toBeCalledTimes(1);
      expect(repository.create).toBeCalledWith(category.name, category.desc);
    });

    it('should throw an error when params violates data limits', async () => {
      const category = {
        name: '',
        desc: '',
      };

      expect(service.create(category)).rejects.toBeInstanceOf(UserError);
      expect(repository.create).toBeCalledTimes(0);
    });

    it('should throw an error when name is duplicate', async () => {
      spy.mockImplementation(() => Promise.resolve(null));

      const category = {
        name: 'boom boom',
        desc: 'qweqeqweqweqweqwe',
      };

      expect(service.create(category)).rejects
        .toThrow('Category with same name already exist');
      expect(repository.create).toBeCalledTimes(1);
      expect(repository.create).toBeCalledWith(category.name, category.desc);
    });
  });

  describe('delete', () => {
    let spy: jest.SpyInstance;

    beforeEach(() => {
      spy = jest.spyOn(repository, 'delete');
    });

    it('should return true when entity deletion is successful', async () => {
      const result = await service.delete(1);

      expect(result).toBe(true);
      expect(repository.delete).toBeCalledTimes(1);
      expect(repository.delete).toBeCalledWith(1);
    });

    it('should return false when entity deletion is failed', async () => {
      spy.mockImplementation(() => Promise.resolve(false));

      const result = await service.delete(1);

      expect(result).toBe(false);
      expect(repository.delete).toBeCalledTimes(1);
      expect(repository.delete).toBeCalledWith(1);
    });
  });

  describe('update', () => {
    let spy: jest.SpyInstance;

    beforeEach(() => {
      spy = jest.spyOn(repository, 'update');
    });

    it('should return true when update performed successfully', async () => {
      const params = {
        id: 1,
        name: 'okawokawokaw',
        desc: 'okawokawokawokawokawok',
      };

      const result = await service.update(params);

      expect(result).toBe(true);
      expect(repository.update).toBeCalledTimes(1);
      expect(repository.update).toBeCalledWith(params);
    });

    it('should throw an error when params violates data limits', async () => {
      const params = {
        id: 'not a number',
        name: 'awokokawokaw',
        desc: 'okawokawok',
      };

      expect(service.update(params)).rejects.toBeInstanceOf(UserError);
      expect(repository.update).toBeCalledTimes(0);
    });

    it('should return false when affected rows is zero', async () => {
      spy.mockImplementation(() => Promise.resolve(false));

      const params = {
        id: 1,
        name: 'okawokawokaw',
        desc: 'okawokawokaww',
      };

      const result = await service.update(params);

      expect(result).toBe(false);
      expect(repository.update).toBeCalledTimes(1);
      expect(repository.update).toBeCalledWith(params);
    });
  });
});
