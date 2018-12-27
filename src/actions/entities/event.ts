import { Schema } from '@app/store';
import { ActionEntities, Action } from '@app/actions';
import * as api from '@app/actions/api';
import { Dispatch } from 'redux';
import { to } from '@app/actions/util';


export interface TeachEventParams {
  start: string,
  end: string,
  name: string,
  room: Schema.Calendar,
  group: Schema.Calendar,
  teacher: Schema.Calendar,
}

const TAG = 'timetable-creator:TEACH_EVENT'

export function createTeachEvent(params: TeachEventParams) {

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
      attendees: [
        {
          email: params.teacher.id,
          responseStatus:'accepted',
        },
        {
          email: params.room.id,
          responseStatus: 'accepted',
        },
        {
          email: params.group.id,
          responseStatus: 'accepted',
        }
      ]
    };

    const owner = params.group.id;

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
      participants: [
        params.teacher.id,
        params.room.id,
      ]
    }

    const action: Action = {
      type: ActionEntities.CREATE_TEACH_EVENT,
      key: id,
      data: e,
    }

    dispatch(action);
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
      attendees: [
        {
          email: params.teacher.id,
          responseStatus:'accepted',
        },
        {
          email: params.room.id,
          responseStatus: 'accepted',
        },
        {
          email: params.group.id,
          responseStatus: 'accepted',
        }
      ]
    };

    const owner = params.group.id;

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
      participants: [
        params.teacher.id,
        params.room.id,
      ]
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
      attendees: [
        {
          email: params.teacher.id,
          responseStatus:'accepted',
        },
        {
          email: params.room.id,
          responseStatus: 'accepted',
        },
        {
          email: params.group.id,
          responseStatus: 'accepted',
        }
      ]
    };

    const owner = params.group.id;

    let data, err;

    [data, err] = await to(api.deleteEvent(owner, event, dispatch));

    if(err) return;

    const action: Action = {
      type: ActionEntities.DELETE_TEACH_EVENT,
      key: eventId,
    };

    dispatch(action);

  }
}
