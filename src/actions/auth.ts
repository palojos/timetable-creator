/*
Authentication actions
*/

import { Schema } from '@app/store';
import { Action, ActionType as Type } from './actionConstants';

interface IsetAuthToken extends Action {
  token: Schema.Token;
  expires_in?: number;
  bearer: Schema.Bearer;
}

export function setAuthToken(token: Schema.Token, expires_in?: number): IsetAuthToken {
  return {
    type: Type.SET_AUTH_TOKEN,
    token,
    expires_in,
    bearer: Schema.Bearer
  }
}

export function invalidateAuthToken(): Action {
  return {
    type: Type.INVALIDATE_AUTH_TOKEN
  }
}
