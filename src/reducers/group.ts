/*
Group reducers
*/

import { Schema } from '@app/store';
import { Action, ActionType as Type } from '@app/actions';
import assign from './assign';

import uuidv4 from 'uuid/v4';

export function groups(state: Schema.Groups = {}, action: Action): Schema.Groups {
  switch (action.type) {
    case Type.ADD_GROUP:
      const id: Schema.EntityId = uuidv4();
      return assign<Schema.Groups>(state)({
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
