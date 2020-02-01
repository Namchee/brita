/*
import {
  BotService,
  BotServiceResult,
  BotServiceParameters,
} from './bot/base';
import { StateRepository } from '../repository/state';
import { State } from '../entity/state';
import { UserError, ServerError } from '../utils/error';

export class ServiceMock extends BotService {
  public constructor() {
    super('pengumuman', false);
  }

  public async handle(
    { text }: BotServiceParameters,
  ): Promise<BotServiceResult> {
    const fragments = text.split(' ');

    if (fragments[1] && fragments[1] === '1') {
      return {
        state: 1,
        message: [],
      };
    } else if (fragments[1] && fragments[1] === '2') {
      return {
        state: 0,
        message: [],
      };
    } else if (fragments[1] && fragments[1] === '3') {
      throw new UserError('');
    }

    throw new ServerError('');
  }
}

export class StateRepositoryMock implements StateRepository {
  async findById(id: string): Promise<State | null> {
    if (id === '1' || id === '1000') {
      return {
        id,
        state: 0,
        service: 'pengumuman',
        text: '',
      };
    } else if (id === '11') {
      return {
        id: '11',
        state: 1,
        service: 'not_exist',
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
    console.log(obj);
    if (obj.id === '1000') {
      return false;
    }

    return true;
  }
}
*/
