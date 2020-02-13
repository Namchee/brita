import { WebhookEvent } from '@line/bot-sdk';
import {
  BotService,
  BotServiceResult,
  BotServiceParameters,
} from './bot/base';
import { StateRepository } from './../repository/state';
import { State } from './../entity/state';
import { UserError, ServerError } from './../utils/error';
import {
  createTextMessage,
  createTextBody,
} from './bot/messaging/messages';

const fakeMessage = createTextMessage(createTextBody(''));

export class ServiceMock extends BotService {
  public constructor() {
    super('pengumuman');
  }

  public async handle(
    { text }: BotServiceParameters,
  ): Promise<BotServiceResult> {
    const fragments = text.split(' ');

    if (fragments[1] && fragments[1] === '1') {
      return {
        state: 0,
        message: [fakeMessage],
      };
    } else if (fragments[1] && fragments[1] === '2') {
      return {
        state: 1,
        message: [fakeMessage],
      };
    } else if (fragments[1] && fragments[1] === '3') {
      return {
        state: 0,
        message: [fakeMessage, fakeMessage],
      };
    } else if (fragments[1] && fragments[1] === '4') {
      throw new UserError('');
    }

    throw new ServerError('');
  }
}

export class StateRepositoryMock implements StateRepository {
  async findById(id: string): Promise<State | null> {
    if (id === '1') {
      return {
        id,
        state: 0,
        service: 'pengumuman',
        text: '',
        misc: new Map(),
      };
    } else if (id === '11') {
      return {
        id: '11',
        state: 1,
        service: 'not_exist',
        text: '',
        misc: new Map(),
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
      text: 'Test text',
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
      text: 'Test text',
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
      text: 'pengumuman 1',
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
      text: 'pengumuman 2',
      id: '1',
    },
    source: {
      type: 'user',
      userId: '69',
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
      text: 'pengumuman 3',
      id: '1',
    },
    source: {
      type: 'user',
      userId: '69',
    },
  };
}

export function createUnsavedStateUserErrorEvent(): WebhookEvent {
  return {
    replyToken,
    type: 'message',
    mode: 'active',
    timestamp: 1,
    message: {
      type: 'text',
      text: 'pengumuman 4',
      id: '1',
    },
    source: {
      type: 'user',
      userId: '69',
    },
  };
}

export function createUnsavedStateServerErrorEvent(): WebhookEvent {
  return {
    replyToken,
    type: 'message',
    mode: 'active',
    timestamp: 1,
    message: {
      type: 'text',
      text: 'pengumuman 5',
      id: '1',
    },
    source: {
      type: 'user',
      userId: '69',
    },
  };
}

export function createSavedStateBuggyServiceNameEvent(): WebhookEvent {
  return {
    replyToken,
    type: 'message',
    mode: 'active',
    timestamp: 1,
    message: {
      type: 'text',
      text: '10',
      id: '1',
    },
    source: {
      type: 'user',
      userId: '11',
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
