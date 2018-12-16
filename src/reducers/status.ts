
import { Schema } from '@app/store';
import { Action } from '@app/actions';

import { assign } from 'lodash/fp';

const DEFAULT_STATE: Schema.Status = {
  calendars: {},
  events: {},
  global: {
    loading: true,
    updating: false,
  },
  errors: [],
};

// dummy resources reducer
export default function status(state: Schema.Status = DEFAULT_STATE , action: Action): Schema.Status {
  switch (action.type) {

    case "GLOBAL":
      return assign(state)({global: action.data});
    default:
      return state;
  }
}
