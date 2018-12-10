import { flow, filter, map, uniq, includes, values, keyBy} from 'lodash/fp';
import { Schema } from '@app/store'

export function applyEventsFilter(state: Schema.Store): Schema.Events {

  const validIds = flow(
    filter<Schema.CalendarFilter>((f: Schema.CalendarFilter) => f.type == "INCLUDE"),
    filter<Schema.CalendarFilter>((f: Schema.CalendarFilter) => f.entity != undefined),
    map<Schema.CalendarFilter, Schema.EntityId>((f) => f.entity ? f.entity : ""),
    uniq
    )(state.filters.calendar);

  const invalidIds = flow(
    filter<Schema.CalendarFilter>((f: Schema.CalendarFilter) => f.type == "EXCLUDE"),
    filter<Schema.CalendarFilter>((f: Schema.CalendarFilter) => f.entity != undefined),
    map<Schema.CalendarFilter, Schema.EntityId>((f) => f.entity ? f.entity : ""),
    uniq
    )(state.filters.calendar);
  
  //const timeBeforeRules = filter<Schema.TimeFilter>((f: Schema.TimeFilter) => f.type == "BEFORE")(state);

  //const timeAfterRules = filter<Schema.TimeFilter>((f: Schema.TimeFilter) => f.type == "AFTER")(state);


  return flow(
    values,
    filter<Schema.TeachEvent>((e: Schema.TeachEvent) => includes(e.id)(validIds)),
    filter<Schema.TeachEvent>((e: Schema.TeachEvent) => !includes(e.id)(invalidIds)),
    keyBy((e: Schema.TeachEvent) => e.id)
  )(state.entities.events);
}