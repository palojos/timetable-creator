import * as I from './interfaces';
import { Schema } from '@app/store';
import { ActionEntities } from '@app/actions/actionConstants';

import uuidv4 from 'uuid/v4';

import { join } from 'lodash/fp';

export function createRoom( name: string, size: number) {
  return createCalendar(name, Schema.CalendarType.ROOM, size);

}

export function createTeacher( name: string ) {
  return createCalendar(name, Schema.CalendarType.TEACHER);
}

export function createGroup( name: string, size: number) {
  return createCalendar(name, Schema.CalendarType.GROUP, size);

}

function createCalendar(name: string, type: Schema.CalendarType, size?: number): (dispatch: any) => any {
  return function(dispatch) {
    const id: Schema.EntityId = uuidv4();
    const tag = 'timetable-creator:[' + join('|')(size ? [ type, name, id, size] : [type, name, id, ]) + ']';
    const calendar: Schema.Calendar = {
      id,
      name,
      description: "",
      meta: {
        type,
        tag,
        ref: "null",
        size
      },
      reserved: []
    };

    const action : I.CreateCalendar = {
      type: ActionEntities.CREATE_CALENDAR,
      key: id,
      data: calendar
    };

    dispatch(action);
  }
}


