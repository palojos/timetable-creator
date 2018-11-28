import { Action } from '@app/actions/actionConstants';
import { Schema } from '@app/store';

export interface SetCalendarFilter extends Action {
  filterType: Schema.CalendarFilterType;
  calendar?: Schema.EntityId;
  calendarType?: Schema.CalendarType
}

export interface SetTimeFilter extends Action {
  filterType: Schema.TimeFilterType;
  time: Date;
}

export interface RemoveCalendarFilter extends Action, SetCalendarFilter {}

export interface RemoveTimeFilter extends Action, SetTimeFilter {}

export interface ClearCalendarFilters extends Action {}

export interface ClearTimeFilters extends Action {}
