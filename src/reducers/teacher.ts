/*
Teacher reducers
*/

import { Schema } from '@app/store';
import { Action, ActionType as Type } from '@app/actions';
import assign from './assign';

import uuidv4 from 'uuid/v4';

export function rooms(state: {[id: string]: Schema.Teacher}, action: Action): {[id: string]: Schema.Teacher} {
  switch (action.type) {
    case Type.ADD_TEACHER:
      const id: Schema.EntityId = uuidv4();
      return assign<{[id: string]: Schema.Teacher}>(state)({
        id: {
          id,
          name: action.name,
        }
      });

    default:
      return state;
  }
}
