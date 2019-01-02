import { Schema } from '@app/store';
import { ActionEntities, ActionResource, entities } from '@app/actions';
import * as api from '@app/actions/api';
import { to } from '@app/actions/util';

import { map, concat } from 'lodash/fp';
import  moment from 'moment';

export function fetch(start: moment.Moment, end: moment.Moment) {

  return async (dispatch: any) => {
    // assign dispatcher to module wide variable
    //indicate that we are starting to load data
    dispatch({
      type: "GLOBAL",
      data: {
        loading: true,
        updating: false,
      },
    });

    let data, err;

    [data, err] = await to(loadCalendarIds(dispatch));

    if(err) return Promise.reject(complete(dispatch));

    [data, err] = await to(loadCalendars(data, dispatch, start.format(), end.clone().add(1, 'day').format() ));

    if(err) return Promise.reject(complete(dispatch));

    return Promise.resolve(complete(dispatch));
  }
}


export function fetchEvents(calendarIds: Schema.EntityId[], start: moment.Moment, end: moment.Moment) {

  return async (dispatch: any) => {
    
    dispatch(entities.clearEvents());

    const collection = map((id: Schema.EntityId) => {
      return loadEvents(id, start.format(), end.clone().add(1, 'day').format(), dispatch);
    })(calendarIds);

    let data, err;

    [data, err] = await to(Promise.all(collection));

    if (err) return Promise.reject(err);

    return Promise.resolve(data);
   }
}

async function loadCalendarIds(dispatch: any, nextPageToken?: string): Promise<Schema.EntityId[]> {

  let list: Schema.EntityId[] = [];

  let data, err;

  [data, err] = await to(api.getCalendarList(dispatch, nextPageToken=nextPageToken));

  if(err) return Promise.reject(err);

  list = map( (i:any) => { return i.id })(data.items);

  if(data.nextPageToken) {
    [data, err] = await to(loadCalendarIds(dispatch, data.nextPageToken));
    if (err) {
      return Promise.reject(err);
    }
    return Promise.resolve(concat(list)(data));
  }

  return Promise.resolve(list);

}

async function loadCalendars(calendarIds: Schema.EntityId[], dispatch: any, start: string, end: string): Promise<any> {

  const collection = map((id: Schema.EntityId) => {
    return loadCalendar(id, start, end, dispatch);
  })(calendarIds);

  let data, err;

  [data, err] = await to(Promise.all(collection));

  if (err) return Promise.reject(err);

  return Promise.resolve(data);
}

async function loadCalendar(calendarId: Schema.EntityId, start: string, end: string, dispatch: any): Promise<any> {

  let data, err;

  [data, err] = await to(api.getCalendar(calendarId, dispatch));

  if (err) return Promise.reject(err);

  const isResource = storeCalendar(data, dispatch);

  if (isResource) return Promise.resolve();

  [data, err] = await to(loadEvents(calendarId, start, end, dispatch,));

  if (err) return Promise.reject(err);

  return Promise.resolve();
}

async function loadEvents(calendarId: Schema.EntityId, timeMin: string, timeMax: string, dispatch: any, nextPageToken?: string): Promise<any> {

  let data, err;

  [data, err] = await to(api.getEventList(calendarId, dispatch, nextPageToken=nextPageToken, timeMin=timeMin, timeMax=timeMax));

  if (err) return Promise.reject(err);

  data.items.map( (i: any) => {
    storeEvent(i, dispatch);
  });

  if (!data.nextPageToken)  return Promise.resolve();

  [data, err] = await to(loadEvents(calendarId, timeMin, timeMax, dispatch, data.nextPageToken));

  if (err) return Promise.reject(err);

  return Promise.resolve();

}

function storeCalendar(gapiCalendar: any, dispatch: any): boolean{

  const meta = parseCalendarMeta(gapiCalendar.description);

  if(meta) {
    const calendar: Schema.Calendar = {
      id: gapiCalendar.id,
      name: gapiCalendar.summary,
      description: gapiCalendar.description,
      meta,
    };

    dispatch({
      type: ActionEntities.CREATE_CALENDAR,
      key: gapiCalendar.id,
      data: calendar,
    });

    return false;
  }

  else {
    const calendar: Schema.CalendarResources = {
      id: gapiCalendar.id,
      name: gapiCalendar.summary,
      description: gapiCalendar.description ? gapiCalendar.description : "",
    };

    dispatch({
      type: ActionResource.CREATE_CALENDAR_RESOURCE,
      key: gapiCalendar.id,
      data: calendar,
    });

    return true;
  }
}

function storeEvent(gapiEvent: any, dispatch: any) {

  const meta = parseEventMeta(gapiEvent.description);

  const id = gapiEvent.organizer.email + "/"  + gapiEvent.id;

  if(meta) {
    const event: Schema.TeachEvent = {
      id,
      name: gapiEvent.summary,
      description: gapiEvent.description ? gapiEvent.description : "",
      meta,
      owner: gapiEvent.organizer.email,
      participants: map( (i: any) => { return i.email } )(gapiEvent.attendees),
      time: {
        start: gapiEvent.start.dateTime ? gapiEvent.start.dateTime : gapiEvent.start.date,
        end: gapiEvent.end.dateTime ? gapiEvent.end.dateTime : gapiEvent.end.date,
      },
    }

    dispatch({
      type: ActionEntities.CREATE_TEACH_EVENT,
      key: id,
      data: event,
    });
  }

  else {
    const event: Schema.EventResource = {
      id,
      name: gapiEvent.summary,
      description: gapiEvent.description ? gapiEvent.description : "",
      owner: gapiEvent.organizer.email,
      participants: map( (i: any) => { return i.email } )(gapiEvent.attendees),
      time: {
        start: gapiEvent.start.dateTime ? gapiEvent.start.dateTime : gapiEvent.start.date,
        end: gapiEvent.end.dateTime ? gapiEvent.end.dateTime : gapiEvent.end.date,
      },
    };

    dispatch({
      type: ActionResource.CREATE_EVENT_RESOURCE,
      key: id,
      data: event,
    });
  }
}

function parseCalendarMeta(data: string = ""): any {
  const re = /timetable-creator:(TEACHER|GROUP|ROOM):?(\d+)?/
  const match = data.match(re);

  if(match) {

    let type: Schema.CalendarType = Schema.CalendarType.ROOM;
    switch (match[1]) {
      case Schema.CalendarType.TEACHER:
        type = Schema.CalendarType.TEACHER;
        break;
      case Schema.CalendarType.GROUP:
        type = Schema.CalendarType.GROUP;
        break;
    }
    const meta = {
      tag: match[0],
      type,
      size: match.length > 2 ? Number(match[2]) : undefined,
    }
    return meta;
  }
  else {
    return null;
  }
}

function parseEventMeta(data: string = "") {
  const re = /timetable-creator:TEACH_EVENT/
  const match = data.match(re);

  if(match) {
    return  {tag: match[0]};
  }
  else {
    return null;
  }
}

function complete(dispatch: any) {
  dispatch({
    type: "GLOBAL",
    data: {
      loading: false,
      updating: false,
    },
  });
}
