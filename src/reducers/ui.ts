import { Schema } from '@app/store';
import { Action, ActionUI } from '@app/actions';

import moment from 'moment';

import { assign, filter, union } from 'lodash/fp';

const defaultState: Schema.UIState = {
  view: {
    start: moment().isoWeekday(1),
    end: moment().isoWeekday(5),
  },
  e_start: moment().startOf('day').hour(9),
  e_end: moment().startOf('day').hour(11),
  name: "",
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

    case ActionUI.SET_E_START:
      return assign(state)({e_start: action.data});

    case ActionUI.SET_E_END:
      return assign(state)({e_end: action.data});

    case ActionUI.CLEAR_PRESETS:
      return assign(state)({
  teacher: undefined,
  group: undefined,
  room: undefined,
  e_start: moment().startOf('day').hour(9),
  e_end: moment().startOf('day').hour(11),
  name: "",
});

    case ActionUI.SET_NAME:
      return assign(state)({name: action.data.name});

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
