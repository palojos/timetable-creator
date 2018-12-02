import * as I from './interfaces';
import { ActionFilter } from '@app/actions/actionConstants';

export function createAfterFilter(time: Date): I.SetTimeFilter {
  return {
    type: ActionFilter.SET_TIME_FILTER,
    filterType: "AFTER",
    time
  }
}

export function createBeforeFilter(time: Date): I.SetTimeFilter {
  return {
    type: ActionFilter.SET_TIME_FILTER,
    filterType: "BEFORE",
    time
  }
}

export function removeAfterFilter(time: Date): I.RemoveTimeFilter {
  return {
    type: ActionFilter.REMOVE_TIME_FILTER,
    filterType: "AFTER",
    time
  }
}

export function removeBeforeFilter(time: Date): I.RemoveTimeFilter {
  return {
    type: ActionFilter.REMOVE_TIME_FILTER,
    filterType: "BEFORE",
    time
  }
}

export function clearTimeFilters(): I.ClearTimeFilters {
  return {
    type: ActionFilter.CLEAR_TIME_FILTERS
  }
}
