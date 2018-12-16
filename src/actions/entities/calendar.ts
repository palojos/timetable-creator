import '@babel/polyfill';
import { Schema } from '@app/store';
import { Action, ActionEntities, ActionResource, api } from '@app/actions';
import { to } from '@app/actions/util';

import { Dispatch } from 'redux';

import { join } from 'lodash/fp';

export function createCalendar(name: string, type: Schema.CalendarType, size?: number): (dispatch: Dispatch<Action>) => Promise<void> {

  return async function(dispatch) {

    let data, err;

    [data, err] = await to(api.postCalendar(name, dispatch));

    if(err) return

    let id = data.id
    let tag = 'timetable-creator:' + join(':')(size ? [ type, size] : [type]);
    let description = tag;
    const calendar: Schema.Calendar = {
      id,
      name,
      description,
      meta: {
        type,
        tag,
        size
      }
    };

    [data, err] = await to(api.putCalendar(id, data.summary, description, dispatch));

    if(err) return

    const action = {
      type: ActionEntities.CREATE_CALENDAR,
      key: id,
      data: calendar
    };

    dispatch(action);

  }
}

export function createCalendarFromResource(resource: Schema.CalendarResource, type: Schema.CalendarType, size?: number): (dispatch: Dispatch<Action>) => Promise<void> {

  return async function(dispatch) {

    let data, err;

    let id = resource.id;
    let name = resource.name;
    let tag = 'timetable-creator:' + join(':')(size ? [ type, size] : [type]);
    let description = resource.description + '\n' + tag;
    const calendar: Schema.Calendar = {
      id,
      name,
      description,
      meta: {
        type,
        tag,
        size
      }
    };

    [data, err] = await to(api.putCalendar(id, name, description, dispatch));

    if(err) return

    const action = {
      type: ActionEntities.CREATE_CALENDAR,
      key: data.id,
      data: calendar
    };

    dispatch(action);

    //removing resource as it is now part of entities
    dispatch({
      type: ActionResource.REMOVE_CALENDAR_RESOURCE,
      key: id
    });
  }
}


