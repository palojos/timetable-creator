import { Schema } from '@app/store';
import { ActionApi } from '@app/actions';
import { Dispatch } from 'redux';
import fetch from './fetch';

import uuidv4 from 'uuid/v4';

export function getCalendarList(nextPageToken?: string, nextSyncToken?: string): any {

  return (dispatch: any) => {

    const nonce = uuidv4();

    console.log("tissit");

    dispatch({
      type: ActionApi.GET_CALENDAR_LIST,
      key: nonce,
      data: {
        id: nonce,
        hasPageToken: nextPageToken != undefined,
        hasSyncToken: nextSyncToken != undefined
      }
    })

    let params : {
      showHidden: boolean
      minAccessRole?: string
      pageToken?: string
      syncToken?: string
    } = {
      showHidden: true
    }

    if (nextPageToken) {
      params.pageToken = nextPageToken;
    }

    if (nextSyncToken) {
      params.syncToken = nextSyncToken
    }

    else {
      params.minAccessRole = "writer"
    }

    return fetch.request({
      method: 'get',
      url: '/calendar/v3/users/me/calendarList',
      params
    }).then( (resp) => {
      dispatch({
        type: ActionApi.GET_CALENDAR_LIST_SUCCESS,
        key: nonce,
        data: {
          id: nonce,
          items: resp.data.items,
          syncToken: resp.data.nextSyncToken
        },
        ref: nonce
      });
      if (resp.data.nextPageToken) {
        dispatch(getCalendarList(resp.data.nextPageToken))
      }

    }).catch( (err) => {
      dispatch({
        type: ActionApi.GET_CALENDAR_LIST_ERROR,
        key: nonce,
        statusCode: err.response.status
      });
    });
  }
}

export function getCalendar(id: Schema.EntityId): (dispatch: Dispatch<any>) => void {

  return (dispatch) => {
    dispatch({
      type: ActionApi.GET_CALENDAR,
      key: id,
      data: {
        id
      }
    })

    return fetch.request({
      method: 'get',
      url: '/calendar/v3/calendars/' + id
    }).then( (resp) => {
      dispatch({
        type: ActionApi.GET_CALENDAR_SUCCESS,
        key: resp.data.id,
        data: {
          id: resp.data.id,
          name: resp.data.summary,
          description: resp.data.description
        },
        ref: id
      });
    }).catch( (err) => {
      dispatch({
        type: ActionApi.GET_CALENDAR_ERROR,
        key: id,
        statusCode: err.response.status
      });
    });
  }
}

export function postCalendar(name: string): (dispatch: Dispatch<any>) => void {

  return (dispatch) => {

    const nonce = uuidv4();

    dispatch({
      type: ActionApi.POST_CALENDAR,
      key: nonce,
      data: {
        id: nonce
      }
    });

    return fetch.request({
      method: 'post',
      url: '/calendar/v3/calendars',
      data: {
        summary: name
      }
    }).then( (resp) => {
      dispatch({
        type: ActionApi.POST_CALENDAR_SUCCESS,
        key: resp.data.id,
        data: {
          id: resp.data.id,
          name: resp.data.summary,
          description: resp.data.description
        },
        ref: nonce
      });
    }).catch( (err) => {
      dispatch({
        type: ActionApi.POST_CALENDAR_ERROR,
        statusCode: err.response.status,
        key: nonce
      });
    });
  }
}

export function putCalendar(id: Schema.EntityId, description: string): (dispatch: Dispatch<any>) => void {

  return (dispatch) => {

    dispatch({
      type: ActionApi.PUT_CALENDAR,
      key: id,
      data: {
        id
      }
    });

    return fetch.request({
      method: 'put',
      url: '/calendar/v3/calendars' + id,
      data: {
        description
      }
    }).then( (resp) => {
      dispatch({
        type: ActionApi.PUT_CALENDAR_SUCCESS,
        key: resp.data.id,
        data: {
          id: resp.data.id,
          name: resp.data.summary,
          description: resp.data.description
        },
        ref: id
      });
    }).catch( (err) => {
      dispatch({
        type: ActionApi.PUT_CALENDAR_ERROR,
        key: id,
        statusCode: err.response.status
      })
    })
  }
}
