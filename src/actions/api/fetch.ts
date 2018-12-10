import axios from 'axios';
import config from '@app/config';

export default axios.create({
      baseURL: config.gapi.urls.api,
      timeout: 1000,
      headers: {'Authorization': "Bearer " + window.localStorage['gapi:token']}
    })
