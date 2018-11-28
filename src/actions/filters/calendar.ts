import * as I from './interfaces';
import { Schema } from '@app/store';
import { ActionFilter } from '@app/actions/actionConstants';

export function createIncludeFilter(calendar: Schema.EntityId): I.SetCalendarFilter {
  return {
    type: ActionFilter.SET_CALENDAR_FILTER,
    filterType: "INCLUDE",
    calendar
  }
}

export function createTypeIncludeFilter(calendarType: Schema.CalendarType): I.SetCalendarFilter {
  return {
    type: ActionFilter.SET_CALENDAR_FILTER,
    filterType: "INCLUDE",
    calendarType
  }
}

export function createExcludeFilter(calendar: Schema.EntityId): I.SetCalendarFilter {
  return {
    type: ActionFilter.SET_CALENDAR_FILTER,
    filterType: "EXCLUDE",
    calendar
  }
}

export function createTypeExcludeFilter(calendarType: Schema.CalendarType): I.SetCalendarFilter {
  return {
    type: ActionFilter.SET_CALENDAR_FILTER,
    filterType: "EXCLUDE",
    calendarType
  }
}

export function removeIncludeFilter(calendar: Schema.EntityId): I.RemoveCalendarFilter {
  return {
    type: ActionFilter.REMOVE_CALENDAR_FILTER,
    filterType: "INCLUDE",
    calendar
  }
}

export function removeTypeIncludeFilter(calendarType: Schema.CalendarType): I.RemoveCalendarFilter {
  return {
    type: ActionFilter.REMOVE_CALENDAR_FILTER¨,
    filterType: "INCLUDE",
    calendarType
  }
}

export function removeExcludeFilter(calendar: Schema.EntityId): I.RemoveCalendarFilter {
  return {
    type: ActionFilter.REMOVE_CALENDAR_FILTER,
    filterType: "EXCLUDE",
    calendar
  }
}

export function removeTypeExcludeFilter(calendarType: Schema.CalendarType): I.RemoveCalendarFilter {
  return {
    type: ActionFilter.REMOVE_CALENDAR_FILTER,
    filterType: "EXCLUDE",
    calendarType
  }
}

export function clearCalendarFilters(): I.ClearCalendarFilters {
  return {
    type: ActionFilter.CLEAR_CALENDAR_FILTERS
  }
}
