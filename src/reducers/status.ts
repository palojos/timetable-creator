
import { Schema } from '@app/store';
import { Action } from '@app/actions';

const DEFAULT_STATE: Schema.Status = {
  teachers: {},
  rooms: {},
  groups: {},
  events: {},
  resources: {},
  global: {
    fetching: false
  }
};

// dummy resources reducer
export default function status(state: Schema.Status = DEFAULT_STATE , action: Action): Schema.Status {
  switch (action.type) {
    default:
      return state;
  }
}
