import ioredis, { Redis } from 'ioredis';
import { StateRepositoryRedis } from './state';

jest.mock('ioredis', () => jest.fn().mockImplementation(() => ({
  get: jest.fn().mockImplementation((a) => {
    return a === 'a' ? '{ "id": "a" }' : null;
  }),
  setex: jest.fn().mockImplementation(() => 'OK'),
  del: jest.fn().mockImplementation(() => 1),
})));

describe('State repository unit test', () => {
  let client: Redis;
  let repository: StateRepositoryRedis;

  beforeAll(() => {
    client = new ioredis();
    repository = new StateRepositoryRedis(client);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('findById', () => {
    it('should return a state when key exist', async () => {
      const state = await repository.findById('a');

      expect(state).toStrictEqual({
        id: 'a',
      });
      expect(client.get).toBeCalledWith('a');
    });

    it('should return null when key is not found', async () => {
      const state = await repository.findById('b');

      expect(state).toBeNull;
      expect(client.get).toBeCalledWith('b');
    });
  });

  describe('create', () => {
    it('should create a new state when key does not exist', async () => {
      const stateData = {
        service: 's',
        state: 1,
        text: 'c',
        misc: new Map(),
      };

      const insertResult = await repository.create('b', 's', 1, 'c', new Map());

      expect(insertResult).toBe(true);
      expect(client.setex).toHaveBeenCalledWith(
        'b',
        expect.any(Number),
        JSON.stringify(stateData),
      );
    });

    it('should return false when key exist', async () => {
      const insertResult = await repository.create('a', 's', 1, 'c', new Map());

      expect(insertResult).toBe(false);
    });
  });

  describe('delete', () => {
    it('should return true when key exist', async () => {
      const deleteResult = await repository.delete('a');

      expect(deleteResult).toBe(true);
      expect(client.del).toHaveBeenCalledWith('a');
    });

    it('should return false when key does not exist', async () => {
      const deleteResult = await repository.delete('b');

      expect(deleteResult).toBe(false);
    });
  });

  describe('update', () => {
    it('should return true when key exist', async () => {
      const state = {
        id: 'a',
        service: 'b',
        state: 1,
        text: 'c',
      };

      const updateResult = await repository.update(state);

      expect(updateResult).toBe(true);
      expect(client.setex).toHaveBeenCalledWith(
        state.id,
        expect.any(Number),
        JSON.stringify({
          service: 'b',
          state: 1,
          text: 'c',
        }),
      );
    });

    it('should return false when key does not exist', async () => {
      const state = {
        id: 'b',
        service: 'b',
        state: 1,
        text: 'c',
      };

      const updateResult = await repository.update(state);

      expect(updateResult).toBe(false);
    });
  });
});
