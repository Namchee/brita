import { WebhookEvent, Message } from '@line/bot-sdk';
import {
  BotService,
  BotServiceResult,
  BotServiceParameters,
} from './bot/base';
import { StateRepository } from './../repository/state';
import { State } from './../entity/state';

const fakeMessage: Message = {
  type: 'text',
  text: '',
};

export class ServiceMock extends BotService {
  public constructor() {
    super('pengumuman');
  }

  public async handle(
    { text }: BotServiceParameters,
  ): Promise<BotServiceResult> {
    if (text === '1') {
      return {
        state: 0,
        message: [fakeMessage],
      };
    } else if (text === '2' || text === 'pengumuman') {
      return {
        state: 1,
        message: [fakeMessage],
      };
    }

    return {
      state: 0,
      message: [fakeMessage, fakeMessage],
    };
  }
}

export class StateRepositoryMock implements StateRepository {
  async findById(id: string): Promise<State | null> {
    if (id === '1') {
      return {
        id,
        state: 0,
        service: 'pengumuman',
        misc: {},
      };
    }

    return null;
  }

  async create(): Promise<boolean> {
    return true;
  }

  async delete(): Promise<boolean> {
    return true;
  }

  async update(obj: State): Promise<boolean> {
    if (obj.id === '1000') {
      return false;
    }

    return true;
  }
}

export const replyToken = 'replyToken';
export const message = 'Text Message';
export const messageArray = 'Text Message Array';
export const messageId = 'message_id';
export const userId = '1';
export const abortMessage = 'abort';
export const serverErrorMessage = 'internal';
export const userErrorMessage = 'user';

export function createNonMessageEvent(): WebhookEvent {
  return {
    replyToken,
    type: 'follow',
    mode: 'active',
    timestamp: 0,
    source: {
      type: 'group',
      groupId: '1',
    },
  };
}

export function createUnsavedStateEvent(): WebhookEvent {
  return {
    replyToken,
    type: 'message',
    mode: 'active',
    timestamp: 1,
    message: {
      type: 'text',
      text: 'pengumuman',
      id: '1',
    },
    source: {
      type: 'user',
      userId: '1',
    },
  };
}

export function createUnsavedStateNonExistentServiceEvent(): WebhookEvent {
  return {
    replyToken,
    type: 'message',
    mode: 'active',
    timestamp: 1,
    message: {
      type: 'text',
      text: 'does_not_exist',
      id: '1',
    },
    source: {
      type: 'user',
      userId: '69',
    },
  };
}

export function createUnsavedStateFinishedStateEvent(): WebhookEvent {
  return {
    replyToken,
    type: 'message',
    mode: 'active',
    timestamp: 1,
    message: {
      type: 'text',
      text: '1',
      id: '1',
    },
    source: {
      type: 'user',
      userId: '69',
    },
  };
}

export function createUnsavedStateUnfinishedStateEvent(): WebhookEvent {
  return {
    replyToken,
    type: 'message',
    mode: 'active',
    timestamp: 1,
    message: {
      type: 'text',
      text: 'pengumuman',
      id: '1',
    },
    source: {
      type: 'user',
      userId: '12780r44',
    },
  };
}

export function createUnsavedStatePushMessagesEvent(): WebhookEvent {
  return {
    replyToken,
    type: 'message',
    mode: 'active',
    timestamp: 1,
    message: {
      type: 'text',
      text: '3',
      id: '1',
    },
    source: {
      type: 'user',
      userId: '1',
    },
  };
}

export function createSavedStateUnfinishedStateEvent(): WebhookEvent {
  return {
    replyToken,
    type: 'message',
    mode: 'active',
    timestamp: 1,
    message: {
      type: 'text',
      text: '2',
      id: '1',
    },
    source: {
      type: 'user',
      userId: '1',
    },
  };
}

export function createSavedStateFinishedStateEvent(): WebhookEvent {
  return {
    replyToken,
    type: 'message',
    mode: 'active',
    timestamp: 1,
    message: {
      type: 'text',
      text: '1',
      id: '1',
    },
    source: {
      type: 'user',
      userId: '1',
    },
  };
}
