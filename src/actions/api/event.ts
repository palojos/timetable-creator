import { Schema } from '@app/store';
import { ActionApi, Action, ui } from '@app/actions';
import { Dispatch } from 'redux';
import { client, to } from '@app/actions/util';
import uuidv4 from 'uuid/v4';

export interface EventApiAction extends Action {
  key: Schema.EntityId;
  flags?: {
    [key: string]: boolean;
  }
  ref?: Schema.EntityId
}

export interface EventApiError extends EventApiAction {
  statusCode: string;
}

export interface Event {
  start: {
    dateTime: string;
  };
  end: {
    dateTime: string;
  };
  attendees?: {
    email: string;
    responseStatus: 'needsAction' | 'accepted' | 'declined' | 'tentative';
  }[];
  description?: string;
  location?: string;
  summary: string;
  id?: string;
  [key: string]: any;
}

export async function getEventList(calendarId: Schema.EntityId, dispatch: Dispatch<any>, nextPageToken?:string, timeMin?: string, timeMax?: string) {

  const get = () => {
    let params: {
      singleEvents: boolean;
      orderBy: 'startTime' | 'updated';
      pageToken?: string;
      syncToken?: string;
      timeMin?: string;
      timeMax?: string;
    } = {
      singleEvents: true,
      orderBy: 'startTime',
    };

    if(nextPageToken) {
      params.pageToken = nextPageToken;
    }

    if(timeMin) {
      params.timeMin = timeMin;
    }

    if(timeMax) {
      params.timeMax = timeMax;
    }

    return client.request({
      method: 'get',
      url: '/calendar/v3/calendars/' + calendarId + '/events',
      params,
      headers: {'Authorization': "Bearer " + window.localStorage['gapi:token']}
    });
  }

  const nonce = uuidv4();
  const flags = {
    hasPageToken: nextPageToken != undefined,
  };

  dispatch({
    type: ActionApi.GET_EVENT_LIST,
    key: nonce,
    flags
  });

  let resp, err;

  [resp, err] = await to(get());

  if(err) {
    dispatch({
      type: ActionApi.GET_EVENT_LIST_ERROR,
      key: nonce,
      flags,
      statusCode: err.response.status
    });
    dispatch(ui.error("Api error: " + err.response.data.error.message ));
    return Promise.reject(err);
  }

  else {
    dispatch({
      type: ActionApi.GET_EVENT_LIST_SUCCESS,
      key: nonce,
      flags
    });
    return Promise.resolve(resp.data);
  }
}

export async function getEvent(calendarId: Schema.EntityId, eventId: Schema.EntityId, dispatch: Dispatch<any>) {
  const get = () => {
    return client.request({
      method: 'get',
      url: '/calendar/v3/calendars/' + calendarId + '/events/' + eventId,
      headers: {'Authorization': "Bearer " + window.localStorage['gapi:token']}
    });
  }

  dispatch({
    type: ActionApi.GET_EVENT,
    key: eventId
  });

  let resp, err;

  [resp, err] = await to(get());

  if(err) {
    dispatch({
      type: ActionApi.GET_EVENT_ERROR,
      key: eventId,
      statusCode: err.response.status
    });
    dispatch(ui.error("Api error: " + err.response.data.error.message ));
    return Promise.reject(err);
  }

  else {
    dispatch({
      type: ActionApi.GET_EVENT_SUCCESS,
      key: resp.data.id
    });
    return Promise.resolve(resp.data);
  }
}

export async function postEvent(calendarId: Schema.EntityId, event: Event, dispatch: Dispatch<any>) {

  const post = () => {
    return client.request({
      method: 'post',
      url: '/calendar/v3/calendars/' + calendarId + '/events',
      headers: {'Authorization': "Bearer " + window.localStorage['gapi:token']},
      data: event,
    });
  }

  const nonce = uuidv4();

  dispatch({
    type: ActionApi.POST_EVENT,
    key: nonce
  });

  let resp, err;

  [resp, err] = await to(post());

  if(err) {
    dispatch({
      type: ActionApi.POST_EVENT_ERROR,
      key: nonce,
      statusCode: err.response.status
    });
    dispatch(ui.error("Api error: " + err.response.data.error.message ));
    return Promise.reject(err);
  }

  else {
    dispatch({
      type: ActionApi.POST_EVENT_SUCCESS,
      key: resp.data.id,
      ref: nonce
    });
    return Promise.resolve(resp.data);
  }
}

export async function putEvent(calendarId: Schema.EntityId, event: Event, dispatch: Dispatch<any>) {

  const put = () => {
    return client.request({
      method: 'put',
      url: '/calendar/v3/calendars/' + calendarId + '/events/' + event.id,
      data: event,
    });
  }

  dispatch({
    type: ActionApi.PUT_EVENT,
    key: event.id
  });

  let resp, err;

  [resp, err] = await to(put());

  if(err) {
    dispatch({
      type: ActionApi.PUT_EVENT_ERROR,
      key: event.id,
      statusCode: err.response.status
    });
    dispatch(ui.error("Api error: " + err.response.data.error.message ));
    return Promise.reject(err);
  }

  else {
    dispatch({
      type: ActionApi.PUT_EVENT_SUCCESS,
      key: resp.data.id,
    });
    return Promise.resolve(resp.data);
  }
}

export async function deleteEvent(calendarId: Schema.EntityId, event: Event, dispatch: Dispatch<any>) {

  const del = () => {
    return client.request({
      method: 'delete',
      url: '/calendar/v3/calendars/' + calendarId + '/events/' + event.id,
      headers: {'Authorization': "Bearer " + window.localStorage['gapi:token']}
    });
  }

  dispatch({
    type: ActionApi.DELETE_EVENT,
    key: event.id
  });

  let resp, err;

  [resp, err] = await to(del());

  if(err) {
    dispatch({
      type: ActionApi.DELETE_EVENT_ERROR,
      key: event.id,
      statusCode: err.response.status
    });
    dispatch(ui.error("Api error: " + err.response.data.error.message ));
    return Promise.reject(err);
  }

  else {
    dispatch({
      type: ActionApi.DELETE_EVENT_SUCCESS,
      key: event.id,
    });
    return Promise.resolve(resp.data);
  }
}
