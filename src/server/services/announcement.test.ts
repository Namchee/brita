import {
  AnnouncementRepositoryMock,
  announcements,
  categories,
} from './test.util';
import { AnnouncementService } from './announcement';
import { PagingOptions } from '../repository/base';
import { UserError } from '../utils/error';

describe('Announcement REST service unit test', () => {
  const repository = new AnnouncementRepositoryMock();
  const service = new AnnouncementService(repository);

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('find', () => {
    beforeEach(() => {
      jest.spyOn(repository, 'findAll');
      jest.spyOn(repository, 'findByCategory');
    });

    it('should return all announcements', async () => {
      const result = await service.find({});

      expect(result).toStrictEqual(announcements);
      expect(repository.findAll).toHaveBeenCalledTimes(1);
    });

    it(
      'should return announcements subset when supplied with pagination params',
      async () => {
        const params: PagingOptions = {
          limit: 2,
          offset: 1,
        };

        const result = await service.find(params);

        expect(result).toStrictEqual(announcements.slice(1, 3));
        expect(repository.findAll).toHaveBeenCalledTimes(1);
        expect(repository.findAll).toHaveBeenCalledWith(params);
      });

    it('should throw an error when invalid parameters are supplied',
      async () => {
        const params: any = {
          limit: 'a string lol',
          offset: 1,
        };

        expect(service.find(params)).rejects.toBeInstanceOf(UserError);
        expect(repository.findAll).toHaveBeenCalledTimes(0);
      });

    it(
      'should return correct announcements when supplied with category params',
      async () => {
        const params: any = {
          limit: 10,
          offset: 0,
          category: categories[0].id,
        };

        const result = await service.find(params);

        expect(result).toStrictEqual(announcements.slice(0, 10));
        expect(repository.findByCategory).toBeCalledTimes(1);
        expect(repository.findByCategory).toHaveBeenCalledWith(
          categories[0].id,
          { limit: 10, offset: 0 },
        );
      },
    );
  });
});
