/*
Authentication actions
*/

import { Schema } from '@app/store';
import { Action } from './actionConstants';
import { SET_AUTH_TOKEN, INVALIDATE_AUTH_TOKEN } from './actionConstants';

interface IsetAuthToken extends Action {
  token: Schema.Token;
  expires_in?: number;
  bearer: Schema.Bearer;
}

export function setAuthToken(token: Schema.Token, expires_in?: number): IsetAuthToken {
  return {
    type: SET_AUTH_TOKEN,
    token,
    expires_in,
    bearer: Schema.Bearer
  }
}

export function invalidateAuthToken(): Action {
  return {
    type: INVALIDATE_AUTH_TOKEN
  }
}
