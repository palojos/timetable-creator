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
        timeZone: 'Europe/Helsinki',
      },
      end: {
        dateTime: params.end,
        timeZone: 'Europe/Helsinki',
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
        }
      ]
    }

    const owner = params.group.id;

    let data, err;

    [data, err] = await to(api.postEvent(owner, event, dispatch));
    console.log(data);

    if(err) return;

    const e: Schema.TeachEvent = {
      id: data.id,
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
      key: data.id,
      data: e,
    }

    dispatch(action);
  }

}