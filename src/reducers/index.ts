
import { combineReducers } from 'redux';

import { Schema } from '@app/store';
import { Action } from '@app/actions';

//Top level auth reducer
import { auth } from './auth';

//Top level entity reducer
import { events } from './event';
import { groups } from './group';
import { rooms } from './room';
import { teachers } from './teacher';

const entities: (state: Schema.Entities, action: Action) => Schema.Entities = combineReducers({
    events,
    groups,
    rooms,
    teachers
  });

const initialValue = {
  auth: {
    access_token: null
  },
  entities: {
    groups: {},
    events: {},
    rooms: {},
    teachers: {}
  }
};

export function rootReducer(state: Schema.Store = initialValue, action: Action): Schema.Store {
  return {
    auth: auth(state.auth, action),
    entities: entities(state.entities, action)
  };
}
