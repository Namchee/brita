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

  describe('find', () => {
    beforeEach(() => {
      jest.spyOn(repository, 'findAll');
      jest.spyOn(repository, 'findByName');
    });

    it('should return all categories', async () => {
      const result = await service.find();

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

        const result = await service.find(params);

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

        expect(service.find(params)).rejects.toBeInstanceOf(UserError);
        expect(repository.findAll).toHaveBeenCalledTimes(0);
      });

    it(
      'should return correct category when supplied with name parameters',
      async () => {
        const params: any = {
          name: categories[0].name,
        };

        const result = await service.find(params);

        expect(result[0]).toStrictEqual(categories[0]);
        expect(repository.findByName).toBeCalledTimes(1);
        expect(repository.findByName).toHaveBeenCalledWith(categories[0].name);
      },
    );
  });
});
