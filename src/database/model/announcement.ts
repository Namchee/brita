import { EntitySchema } from 'typeorm';
import { Announcement } from '../../entity/announcement';

export const AnnouncementEntity = new EntitySchema<Announcement>({
  name: 'announcement',
  tableName: 'announcement',
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
      nullable: false,
    },
    title: {
      type: String,
      unique: true,
      length: 25,
      nullable: false,
    },
    content: {
      type: String,
      length: 300,
      nullable: false,
    },
    validUntil: {
      type: Date,
      name: 'valid_until',
      nullable: false,
    },
    important: {
      type: Boolean,
      nullable: false,
    },
  },
  relations: {
    categories: {
      type: 'many-to-many',
      joinTable: {
        name: 'announcement_categories',
        joinColumn: {
          name: 'announcement_id',
        },
        inverseJoinColumn: {
          name: 'category_id',
        }
      },
      target: 'category',
    },
  },
});
