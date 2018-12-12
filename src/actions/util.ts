import '@babel/polyfill';
import axios from 'axios';
import config from '@app/config';

export const client = axios.create({
      baseURL: config.gapi.urls.api,
      timeout: 10000,
    });

export function to(promise: Promise<any>) {
   return promise.then(data => {
      return [data, null];
   })
   .catch(err => [null, err]);
}
