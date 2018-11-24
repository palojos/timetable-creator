/*
Room reducers
*/

import { Schema } from '@app/store';
import { Action, ActionType as Type } from '@app/actions';
import assign from './assign';

import uuidv4 from 'uuid/v4';

export function rooms(state: {[id: string]: Schema.Room}, action: Action): {[id: string]: Schema.Room} {
  switch (action.type) {
    case Type.ADD_ROOM:
      const id: Schema.EntityId = uuidv4();
      return assign<{[id: string]: Schema.Room}>(state)({
        id: {
          id,
          name: action.name,
          capacity: action.capacity
        }
      });

    default:
      return state;
  }
}
