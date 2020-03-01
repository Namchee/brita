import { CategoryService } from './category';
import { CategoryRepositoryMock, categories } from './test.util';
import { PagingOptions } from '../repository/base';
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
    });

    it('should return all categories', async () => {
      const result = await service.findAll();

      expect(result).toStrictEqual(categories);
      expect(repository.findAll).toHaveBeenCalledTimes(1);
    });

    it(
      'should return categories subset when supplied with parameters',
      async () => {
        const params: PagingOptions = {
          limit: 1,
          offset: 1,
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
          offset: 1,
        };

        expect(service.findAll(params)).rejects.toBeInstanceOf(UserError);
        expect(repository.findAll).toHaveBeenCalledTimes(0);
      });
  });
});
