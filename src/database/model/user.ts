import { EntitySchema } from 'typeorm';
import { User } from '../../entity/user';

export const UserEntity = new EntitySchema<User>({
  name: 'user',
  tableName: 'administrator',
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
      nullable: false,
    },
    name: {
      type: String,
      length: 100,
      nullable: true,
    },
    email: {
      type: String,
      length: 100,
      nullable: false,
    },
    profilePic: {
      type: String,
      length: 200,
      name: 'profile_pic',
      nullable: true,
    },
    isRoot: {
      type: Boolean,
      name: 'is_root',
      nullable: false,
    },
    isActive: {
      type: Boolean,
      name: 'is_active',
      nullable: false,
    },
  },
});
