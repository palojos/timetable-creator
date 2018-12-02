import {Schema} from '@app/store';
import { Action, ActionEntities } from '@app/actions';

import { combineReducers } from 'redux';

import assign from '@app/reducers/assign';


function calendars(state: Schema.Calendars = {}, action: Action): Schema.Calendars {
  switch (action.type) {
    case ActionEntities.CREATE_CALENDAR:
      return assign<Schema.Calendars>(state)({[action.key]: action.data});

    case ActionEntities.CLEAR_ENTITIES:
      return {};

    default:
      return state;
  }
}

function events(state: Schema.Events = {}, action: Action): Schema.Events {
  switch (action.type) {
    case ActionEntities.CLEAR_ENTITIES:
     return {};

    default:
      return state;
  }
}

export default combineReducers({
  calendars,
  events
})
