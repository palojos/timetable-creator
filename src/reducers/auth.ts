/*
Auth reducers
*/

import { Schema } from '@app/store';
import { Action } from '@app/actions';

//dummy auth reducer
export default function auth(state: Schema.Auth = {access_token: null}, action: Action): Schema.Auth {
  switch (action.type) {

    default:
      return state;
  }
}
