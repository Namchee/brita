import { WebhookEvent, Message } from '@line/bot-sdk';
import {
  BotService,
  BotServiceResult,
  BotServiceParameters,
} from './bot-services/base';
import { StateRepository } from '../repository/state';
import { State } from '../entity/state';
import { AnnouncementRepository } from './../repository/announcement';
import { CategoryRepository } from './../repository/category';
import { Announcement } from './../entity/announcement';
import { Category } from './../entity/category';
import { PagingOptions } from './../repository/base';

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

const tommorow = new Date();
tommorow.setDate(tommorow.getDate() + 1);

export const categories: Category[] = [
  {
    id: 1,
    name: 'One',
    desc: 'This is category one',
    announcementCount: 1,
  },
  {
    id: 2,
    name: 'Two',
    desc: 'This is category two',
    announcementCount: 1,
  },
  {
    id: 3,
    name: 'Three',
    desc: 'This is category three',
    announcementCount: 1,
  },
];

export const announcements: Announcement[] = [
  {
    id: 1,
    title: 'Announcement One',
    contents: 'This is announcement one',
    validUntil: new Date(),
    categories: [categories[0], categories[1]],
  },
  {
    id: 2,
    title: 'Announcement Two',
    contents: 'This is announcement two',
    validUntil: new Date(),
    categories: [categories[0], categories[2]],
  },
  {
    id: 3,
    title: 'Announcement Three',
    contents: 'This is announcement three',
    validUntil: tommorow,
    categories: [categories[1]],
  },
  {
    id: 3,
    title: 'Announcement Three',
    contents: 'This is announcement three',
    validUntil: tommorow,
  },
  {
    id: 3,
    title: 'Announcement Three',
    contents: 'This is announcement three',
    validUntil: tommorow,
  },
  {
    id: 3,
    title: 'Announcement Three',
    contents: 'This is announcement three',
    validUntil: tommorow,
  },
  {
    id: 3,
    title: 'Announcement Three',
    contents: 'This is announcement three',
    validUntil: tommorow,
  },
  {
    id: 3,
    title: 'Announcement Three',
    contents: 'This is announcement three',
    validUntil: tommorow,
  },
  {
    id: 3,
    title: 'Announcement Three',
    contents: 'This is announcement three',
    validUntil: tommorow,
  },
  {
    id: 3,
    title: 'Announcement Three',
    contents: 'This is announcement three',
    validUntil: tommorow,
  },
  {
    id: 3,
    title: 'Announcement Three',
    contents: 'This is announcement three',
    validUntil: tommorow,
  },
];

export class AnnouncementRepositoryMock implements AnnouncementRepository {
  public findAll = async (options?: PagingOptions): Promise<Announcement[]> => {
    return options ?
      announcements.slice(
        options.offset,
        (options?.offset || 0) + (options?.limit || 0),
      ) :
      announcements;
  }

  public findByCategory = async (
    category: Category,
    options?: PagingOptions,
  ): Promise<Announcement[]> => {
    if (category.id === categories[0].id) {
      if (options && options?.offset === 0) {
        return announcements.slice(0, 10);
      } else if (options?.offset === 10) {
        return announcements.slice(10, 11);
      } else {
        return [];
      }
    }

    return [];
  }

  // we don't need this
  public create = async () => {
    return null;
  }

  // we don't need this
  public delete = async () => {
    return true;
  }

  // we don't need this
  public update = async () => {
    return true;
  }
}

export class CategoryRepositoryMock implements CategoryRepository {
  public findAll = async (options?: PagingOptions): Promise<Category[]> => {
    return options ?
      categories.slice(
        options.offset,
        (options?.offset || 0) + (options?.limit || 0),
      ) :
      categories;
  }

  public findAllWithoutCount = async (
    options?: PagingOptions,
  ): Promise<Category[]> => {
    return await this.findAll(options);
  }

  public findByName = async (name: string): Promise<Category | null> => {
    return (name === categories[0].name) ? categories[0] : null;
  }

  // we don't need this
  create = async () => {
    return null;
  }

  // we don't need this
  delete = async () => {
    return true;
  }

  // we don't need this
  update = async () => {
    return true;
  }
}
