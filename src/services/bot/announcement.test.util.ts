import { AnnouncementRepository } from '../../repository/announcement';
import { CategoryRepository } from '../../repository/category';
import { Announcement } from '../../entity/announcement';
import { Category } from '../../entity/category';

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

export const announcements = [
  {
    id: 1,
    title: 'Announcement One',
    content: 'This is announcement one',
    validUntil: new Date(),
    important: false,
  },
  {
    id: 2,
    title: 'Announcement Two',
    content: 'This is announcement two',
    validUntil: new Date(),
    important: true,
  },
  {
    id: 3,
    title: 'Announcement Three',
    content: 'This is announcement three',
    validUntil: tommorow,
    important: true,
  },
];

export class AnnouncementRepositoryMock implements AnnouncementRepository {
  public findAll = async (): Promise<Announcement[]> => {
    return announcements;
  }

  public findByCategory = async (
    category: Category,
  ): Promise<Announcement[]> => {
    return category.id === categories[0].id ? announcements : [];
  }

  public create = async () => {
    return null;
  }

  public delete = async () => {
    return true;
  }

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

  create = async () => {
    return null;
  }

  delete = async () => {
    return true;
  }

  update = async () => {
    return true;
  }
}
