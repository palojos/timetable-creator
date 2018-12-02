import { Action } from '@app/actions/actionConstants';
import { Schema } from '@app/store';

export interface CreateCalendar extends Action {
  key: Schema.EntityId;
  data: Schema.Calendar;
}

export interface CreateTeachEvent extends Action, Schema.TeachEvent {}

export interface UpdateTeachEvent extends Action {
  id: Schema.EntityId;
  name?: string;
  description?: string;
  meta: {
    tag?: string;
    ref?: string;
  }
  time: {
    start?: Date;
    end?: Date;
  }
}

export interface DeleteTeachEvent extends Action {
  id: Schema.EntityId;
}
export interface ClearEntities extends Action {}

export interface UpdateTeachEventArgs {
  name?: string;
  description?: string;
  meta?: {
    type?: Schema.CalendarType;
    tag?: string;
    ref?: string;
    size?: number;
  }
}
