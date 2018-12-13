import { Schema } from '@app/store';
import { Action, ActionResource } from '@app/actions';

import { combineReducers } from 'redux';


import { omit, assign } from 'lodash/fp';

function calendars(state: Schema.CalendarResources = {}, action: Action): Schema.CalendarResources {
  switch (action.type) {

    case ActionResource.CREATE_CALENDAR_RESOURCE:
      return assign(state)({[action.key]: action.data});

    case ActionResource.REMOVE_CALENDAR_RESOURCE:
      return omit([action.key])(state);

    case ActionResource.CLEAR_RESOURCES:
      return {};

    default:
      return state;
  }
}

function events(state: Schema.EventResources = {}, action: Action): Schema.EventResources {
  switch (action.type) {

    case ActionResource.CREATE_EVENT_RESOURCE:
      return assign(state)({[action.key]: action.data});

    case ActionResource.REMOVE_EVENT_RESOURCE:
      return omit([action.key])(state);

    case ActionResource.CLEAR_RESOURCES:
      return {};

    default:
      return state;
  }
}

export default combineReducers({
  calendars,
  events
})
