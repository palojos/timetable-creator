import { Schema } from '@app/store';
import { ActionApi, Action, ui } from '@app/actions';
import { Dispatch } from 'redux';
import { client, to } from '@app/actions/util';
import uuidv4 from 'uuid/v4';

export interface CalendarApiAction extends Action {
  key: Schema.EntityId;
  flags?: {
    [key: string]: boolean;
  }
  ref?: Schema.EntityId
}

export interface CalendarApiError extends CalendarApiAction {
  statusCode: number;
}

export async function getCalendarList(dispatch: Dispatch<any>, nextPageToken?: string) {

  const get = () => {
    let params : {
      showHidden: boolean
      minAccessRole?: string
      pageToken?: string
    } = {
      showHidden: true
    }

    if (nextPageToken) {
      params.pageToken = nextPageToken;
    }

    else {
      params.minAccessRole = "writer";
    }

    return client.request({
      method: 'get',
      url: '/calendar/v3/users/me/calendarList',
      params,
      headers: {'Authorization': "Bearer " + window.localStorage['gapi:token']}
    });
  }

  const nonce = uuidv4();
  const hasPageToken = nextPageToken != undefined;

  dispatch({
    type: ActionApi.GET_CALENDAR_LIST,
    key: nonce,
    flags: {
      hasPageToken,
     
    }
  });

  let resp, err;

  [resp, err] = await to(get());

  if(err) {
    dispatch({
      type: ActionApi.GET_CALENDAR_LIST_ERROR,
      key: nonce,
      statusCode: err.response.status,
      flags: {
        hasPageToken
      }
    });
    dispatch(ui.error("Api error: " + err.response.data.error.message ));
    return Promise.reject(err);
  }

  else {
    dispatch({
      type: ActionApi.GET_CALENDAR_LIST_SUCCESS,
      key: nonce,
      flags: {
        hasPageToken
      }
    });
    return Promise.resolve(resp.data)
  }
}

export async function getCalendar(id: Schema.EntityId, dispatch: Dispatch<any>) {

  const get = () => {
    return client.request({
      method: 'get',
      url: '/calendar/v3/calendars/' + id,
      headers: {'Authorization': "Bearer " + window.localStorage['gapi:token']}
    });
  }

  dispatch({
    type: ActionApi.GET_CALENDAR,
    key: id
  });

  let resp, err;

  [resp, err] = await to(get());

  if(err) {
    dispatch({
      type: ActionApi.GET_CALENDAR_ERROR,
      statusCode: err.response.status,
      key: id
    });
    dispatch(ui.error("Api error: " + err.response.data.error.message ));
    return Promise.reject(err);
  }

  else {
    dispatch({
      type:ActionApi.GET_CALENDAR_SUCCESS,
      key: resp.data.id
    });
    return Promise.resolve(resp.data);
  }
}

export async function postCalendar(name: string, dispatch: Dispatch<any>) {

  const post = () => {
    return client.request({
      method: 'post',
      url: '/calendar/v3/calendars',
      data: {
        summary: name
      },
      headers: {'Authorization': "Bearer " + window.localStorage['gapi:token']}
    });
  }

  const nonce = uuidv4();

  dispatch({
    type: ActionApi.POST_CALENDAR,
    key: nonce
  });

  let resp, err;

  [resp, err] = await to(post());

  if(err) {
    dispatch({
      type: ActionApi.POST_CALENDAR_ERROR,
      statusCode: err.response.status,
      key: nonce
    });
    dispatch(ui.error("Api error: " + err.response.data.error.message ));
    return Promise.reject(err);
  }

  else {
    dispatch({
      type: ActionApi.POST_CALENDAR_SUCCESS,
      key: resp.data.id,
      ref: nonce
    });
    return Promise.resolve(resp.data);
  }
}

export async function putCalendar(id: Schema.EntityId, name: string, description: string, dispatch: Dispatch<any>) {

  const put = () => {
    return client.request( {
      method: 'put',
      url: '/calendar/v3/calendars/' + id,
      data: {
        description,
        summary: name,
        timeZone: "Europe/Helsinki"
      },
      headers: {'Authorization': "Bearer " + window.localStorage['gapi:token']}
    });
  }

  dispatch({
    type: ActionApi.PUT_CALENDAR,
    key: id
  });

  let resp, err;

  [resp, err] = await to(put());

  if(err) {
    dispatch({
      type: ActionApi.PUT_CALENDAR_ERROR,
      statusCode: err.response.status,
      key: id
    });
    dispatch(ui.error("Api error: " + err.response.data.error.message ));
    return Promise.reject(err)
  }

  else {
    dispatch({
      type: ActionApi.PUT_CALENDAR_SUCCESS,
      key: resp.data.id
    });
    return Promise.resolve(resp.data);
  }
}
