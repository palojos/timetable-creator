import {Schema} from '@app/store';
import { Action, ActionEntities, ActionEventParticipants } from '@app/actions';

import { combineReducers } from 'redux';

import { omit, assign, union, remove } from 'lodash/fp';


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
  let event: any
  let prev: Schema.TeachEvent
  switch (action.type) {
    case ActionEntities.CLEAR_ENTITIES:
      return {};

    case ActionEntities.CREATE_TEACH_EVENT:
      return assign<Schema.Events>(state)({[action.key]: action.data});

    case ActionEntities.UPDATE_TEACH_EVENT:
      prev = state[action.key];
      event = action.data;
      event.participants = prev.participants;

      return assign(state)({[action.key]:event});

    case ActionEntities.DELETE_TEACH_EVENT:
      return omit([action.key])(state);

    case ActionEventParticipants.SET_PARTICIPANT:
      event = state[action.key];
      event.participants = union(event.participants)([action.data.participant]);

      return assign(state)({[action.key]:event});

    case ActionEventParticipants.REMOVE_PARTICIPANT:
      event = state[action.key];
      event.participants = remove(action.data.participant)(event.participants);
      return assign(state)({[action.key]: event});

    default:
      return state;
  }
}

export default combineReducers({
  calendars,
  events
})
