import {
  BotService,
  BotServiceResult,
} from '../services/bot/base';
import { StateRepository } from '../repository/state';
import { State } from '../entity/state';

export class ServiceMock extends BotService {
  public constructor() {
    super('pengumuman', false);
  }

  public async handle(): Promise<BotServiceResult> {
    return {
      state: 0,
      message: [],
    };
  }
}

export class StateRepositoryMock implements StateRepository {
  async findById(id: string): Promise<State | null> {
    if (id === '1') {
      return {
        id: '1',
        state: 0,
        service: 'pengumuman',
        text: '',
      };
    } else {
      return null;
    }
  }

  async create(
    id: string,
    service: string,
    state: number,
    text: string,
  ): Promise<boolean> {
    return true;
  }

  async delete(id: string): Promise<boolean> {
    return true;
  }

  async update(obj: State): Promise<boolean> {
    return true;
  }
}
