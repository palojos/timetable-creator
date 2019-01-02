import { Schema } from '@app/store';
import { ActionEntities, Action } from '@app/actions';
import * as api from '@app/actions/api';
import { Dispatch } from 'redux';
import { to } from '@app/actions/util';

import { map } from 'lodash/fp';


export interface TeachEventParams {
  start: string,
  end: string,
  name: string,
  room: Schema.Calendar,
  attendees: Schema.Calendar[],
}

const TAG = 'timetable-creator:TEACH_EVENT'

export function createTeachEvent(history: any, params: TeachEventParams) {

  return async (dispatch: Dispatch) => {

  const event: api.Event = {
      start: {
        dateTime: params.start,
      },
      end: {
        dateTime: params.end,
      },
      summary: params.name,
      description: TAG,
      location: params.room.name,
      attendees: map<Schema.Calendar, {email: string; responseStatus: 'accepted'}>((c: Schema.Calendar) => {return {email: c.id, responseStatus: 'accepted'}})(params.attendees)
    };

    const owner = params.room.id;

    let data, err;

    [data, err] = await to(api.postEvent(owner, event, dispatch));

    if(err) return;

    const id = owner + '/' + data.id;

    const e: Schema.TeachEvent = {
      id,
      name: data.summary,
      owner,
      description: data.description,
      meta: {
        tag: TAG
      },
      time: {
        start: data.start.dateTime,
        end: data.end.dateTime
      },
      participants: map<Schema.Calendar, string>((c: Schema.Calendar) => c.id)(params.attendees),
    }

    const action: Action = {
      type: ActionEntities.CREATE_TEACH_EVENT,
      key: id,
      data: e,
    }

    dispatch(action);
    history.push("/dashboard");
  }
}

export function updateTeachEvent(eventId: Schema.EntityId, params: TeachEventParams) {

  return async (dispatch: any) => {

  const id = eventId.split("/")[1]
  const event: api.Event = {
      start: {
        dateTime: params.start,
      },
      end: {
        dateTime: params.end,
      },
      id: id,
      summary: params.name,
      description: TAG,
      location: params.room.name,
      attendees: map<Schema.Calendar, {email: string; responseStatus: 'accepted'}>((c: Schema.Calendar) => {return {email: c.id, responseStatus: 'accepted'}})(params.attendees)
    };

    const owner = params.room.id;

    let data, err;

    [data, err] = await to(api.putEvent(owner, event, dispatch));

    if(err) return;

    const e: Schema.TeachEvent = {
      id,
      name: data.summary,
      owner,
      description: data.description,
      meta: {
        tag: TAG
      },
      time: {
        start: data.start.dateTime,
        end: data.end.dateTime
      },
      participants: map<Schema.Calendar, string>((c: Schema.Calendar) => c.id)(params.attendees)
    }

    const action: Action = {
      type: ActionEntities.UPDATE_TEACH_EVENT,
      key: e.id,
      data: e,
    };

    dispatch(action);
  }
}

export function deleteTeachEvent(eventId: Schema.EntityId, params: TeachEventParams) {

  return async function(dispatch: any) {
    const id = eventId.split("/")[1]
    const event: api.Event = {
      start: {
        dateTime: params.start,
      },
      end: {
        dateTime: params.end,
      },
      id: id,
      summary: params.name,
      description: TAG,
      location: params.room.name,
      attendees: map<Schema.Calendar, {email: string; responseStatus: 'accepted'}>((c: Schema.Calendar) => {return {email: c.id, responseStatus: 'accepted'}})(params.attendees)
    };

    const owner = params.room.id;

    let data, err;

    [data, err] = await to(api.deleteEvent(owner, event, dispatch));

    if(err) return;

    const action: Action = {
      type: ActionEntities.DELETE_TEACH_EVENT,
      key: eventId,
      data,
    };

    dispatch(action);

  }
}
