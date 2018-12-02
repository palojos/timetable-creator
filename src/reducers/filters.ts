import { Schema } from '@app/store';
import { Action, ActionFilter } from '@app/actions';

import {combineReducers} from 'redux';

import { flow, union, uniq, remove, matches} from 'lodash/fp';



function calendar(state: Schema.CalendarFilter[] = [], action: Action): Schema.CalendarFilter[] {
  switch (action.type) {
   case ActionFilter.SET_CALENDAR_FILTER:
      return flow(union(state), uniq)([{
        type: action.filterType,
        entity: action.calendar,
        calendarType: action.calendarType
      }]);

    case ActionFilter.REMOVE_CALENDAR_FILTER:
      return remove((item: Schema.CalendarFilter):boolean => {
        return matches({
          type: action.filterType,
          entity: action.calendar,
          calendarType: action.calendarType
        })(item);
      })(state);

    case ActionFilter.CLEAR_TIME_FILTERS:
      return [];

    default:
      return state;
  }
}

function time(state: Schema.TimeFilter[] = [], action: Action): Schema.TimeFilter[] {
  switch (action.type) {
    case ActionFilter.SET_TIME_FILTER:
      return flow(union(state), uniq)([{
        type: action.filterType,
        time: action.time
      }]);

    case ActionFilter.REMOVE_TIME_FILTER:
      return remove((item: Schema.TimeFilter):boolean => {
        return matches({
          type: action.filterType,
          time: action.time
        })(item);
      })(state);

    case ActionFilter.CLEAR_TIME_FILTERS:
      return [];

    default:
      return state;
  }
}

export default combineReducers({
  calendar,
  time
})
