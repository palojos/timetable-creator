import React from 'react';
import { Redirect } from 'react-router-dom';
import { flow, split, map, keyBy, mapValues} from 'lodash/fp';

import moment from 'moment';


export const LoginHandler = () => {

  const params:any = flow(
    split('&'),
    map((e: string) => {
      const r = split('=')(e)
      return {key: r[0], value: r[1]}
    }),
    keyBy('key'),
    mapValues('value')
    )(window.location.hash.slice(1));

  const nonce = window.localStorage['login:nonce'];



  if( !params.error && nonce == params.state) {
    window.localStorage['gapi:token'] = params['access_token'];
    window.localStorage['gapi:expires_in'] = params['expires_in'];
    window.localStorage['gapi:acquired_at'] = moment().format();
  }

  window.localStorage['login:nonce'] = ""

  return (
    <Redirect to="" />
  );

}
