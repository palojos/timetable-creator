/*
Auth reducers
*/

import { Schema } from '@app/store';
import { Action, ActionType as Type } from '@app/actions';
import assign from './assign';

export function auth(state: Schema.Auth = {access_token: null}, action: Action): Schema.Auth {
  switch (action.type) {
    case Type.SET_AUTH_TOKEN:
      return  assign<Schema.Auth>(state)({
        access_token: action.token,
        acquired_time: undefined,
        expires_in: action.expires_in,
        type: action.bearer
      });
    case Type.INVALIDATE_AUTH_TOKEN:
      return assign<Schema.Auth>(state)({
        access_token: null,
        expires_in: undefined,
        acquired_time: undefined,
        type: undefined
      });
    default:
      return state;
  }
}
