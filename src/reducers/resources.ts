
import { Schema } from '@app/store';
import { Action } from '@app/actions';

// dummy resources reducer
export default function resources(state: Schema.Resources = {calendars: []}, action: Action): Schema.Resources {
  switch (action.type) {
    default:
      return state;
  }
}
