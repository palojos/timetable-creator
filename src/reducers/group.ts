/*
Group reducers
*/

import { Schema } from '@app/store';
import { Action, ActionType as Type } from '@app/actions';
import assign from './assign';

import uuidv4 from 'uuid/v4';

export function groups(state: {[id: string]: Schema.Group}, action: Action): {[id: string]: Schema.Group} {
  switch (action.type) {
    case Type.ADD_GROUP:
      const id: Schema.EntityId = uuidv4();
      return assign<{[id: string]: Schema.Group}>(state)({
        id: {
          id,
          name: action.name,
          size: action.size
        }
      });
    default:
      return state;
  }
}
