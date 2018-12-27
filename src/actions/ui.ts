import { Schema } from '@app/store';
import { ActionUI, Action } from '@app/actions';
import moment from 'moment';
import uuidv4 from 'uuid/v4';

export function selectOne(calendar: Schema.Calendar) {

  const action: Action = {
    type: ActionUI.SELECT_ONE,
    key: calendar.id,
    data: {
      id: calendar.id,
      calendarType: calendar.meta.type,
    },
  };

  return action;
};

export function selectAll(type: Schema.CalendarType) {
  const action: Action = {
    type: ActionUI.SELECT_ALL,
    key: undefined,
    data: {
      id: undefined,
      calendarType: type,
    },
  };

  return action;
}


export function setView(start: moment.Moment, end: moment.Moment) {

  const action: Action = {
    type: ActionUI.SET_VIEW,
    data: {
      start,
      end,
    },
  };

  return action;
}

export function clearPresets() {

  const action: Action = {
    type: ActionUI.CLEAR_PRESETS
  }

  return action;
}

export function error(message: string) {

  const id = uuidv4();

  const action: Action = {
    type: "ERROR",
    key: id,
    data: {id, message}
  }

  return action;
}

export function closeError(err: Schema.UIError) {

  const action: Action = {
    type: "CLOSE_ERROR",
    key: err.id,
    data: err,
  }

  return action;
}
