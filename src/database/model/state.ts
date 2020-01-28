import { EntitySchema } from 'typeorm';
import { State } from '../../entity/state';

export const StateEntity = new EntitySchema<State>({
  name: 'state',
  columns: {
    id: {
      type: String,
      primary: true,
      nullable: false,
    },
    service: {
      type: String,
      nullable: false,
    },
    state: {
      type: Number,
      nullable: false,
    },
    text: {
      type: String,
      nullable: false,
    },
    lastUpdate: {
      type: Date,
      nullable: false,
    },
  },
});
