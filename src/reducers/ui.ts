import { Schema } from '@app/store';
import { Action, ActionUI } from '@app/actions';

import moment from 'moment';

import { assign, filter, union } from 'lodash/fp';

const defaultState: Schema.UIState = {
  view: {
    start: moment().isoWeekday(1),
    end: moment().isoWeekday(5),
  },
  error: [],
};

export default function ui(state: Schema.UIState = defaultState, action: Action ): Schema.UIState {


  switch (action.type) {

    case ActionUI.SELECT_ONE:
      switch (action.data.calendarType) {
        case Schema.CalendarType.TEACHER:
          return assign(state)({teacher: action.data.id});

        case Schema.CalendarType.ROOM:
          return assign(state)({room: action.data.id});

        case Schema.CalendarType.GROUP:
          return assign(state)({group: action.data.id});
      }
      return state;

    case ActionUI.SELECT_ALL:
      switch (action.data.calendarType) {
        case Schema.CalendarType.TEACHER:
          return assign(state)({teacher: undefined});

        case Schema.CalendarType.ROOM:
          return assign(state)({room: undefined});

        case Schema.CalendarType.GROUP:
          return assign(state)({group: undefined});
      }
      return state;

    case ActionUI.SET_VIEW:
      return assign(state)({view: action.data});

    case ActionUI.CLEAR_PRESETS:
      return assign(state)({teacher: undefined, group: undefined, room: undefined});

    case ActionUI.ERROR:
      return assign(state)({error: error(state.error, action)});

    case ActionUI.CLOSE_ERROR:
      return assign(state)({error: error(state.error, action)});

    default:
      return state;
  }
}

function error(state: Schema.UIError[], action: Action): Schema.UIError[] {
  switch (action.type) {
    case ActionUI.ERROR:
      return union(state)([action.data]);

    case ActionUI.CLOSE_ERROR:
      return filter((e: Schema.UIError) => e.id !== action.key)(state);

    default:
      return state;
  }
}
