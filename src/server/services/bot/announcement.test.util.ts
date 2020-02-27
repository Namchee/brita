import { AnnouncementRepository } from '../../repository/announcement';
import { CategoryRepository } from '../../repository/category';
import { Announcement } from '../../entity/announcement';
import { Category } from '../../entity/category';
import { PagingOptions } from '../../repository/base';

const tommorow = new Date();
tommorow.setDate(tommorow.getDate() + 1);

export const categories = [
  {
    id: 1,
    name: 'One',
    desc: 'This is category one',
  },
  {
    id: 2,
    name: 'Two',
    desc: 'This is category two',
  },
  {
    id: 3,
    name: 'Three',
    desc: 'This is category three',
  },
];

export const announcements: Announcement[] = [
  {
    id: 1,
    title: 'Announcement One',
    contents: 'This is announcement one',
    validUntil: new Date(),
  },
  {
    id: 2,
    title: 'Announcement Two',
    contents: 'This is announcement two',
    validUntil: new Date(),
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
  {
    id: 3,
    title: 'Announcement Three',
    contents: 'This is announcement three',
    validUntil: tommorow,
  },
];

export class AnnouncementRepositoryMock implements AnnouncementRepository {
  public findAll = async (): Promise<Announcement[]> => {
    return announcements;
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
  public findAll = async (): Promise<Category[]> => {
    return categories;
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
