import { Action } from '@app/actions/actionConstants';
import { Schema } from '@app/store';

export interface CreateCalendar extends Action {
  key: Schema.EntityId;
  data: Schema.Calendar;
}

export interface CreateTeachEvent extends Action {
  key: Schema.EntityId;
  data: Schema.TeachEvent;
}

export interface UpdateTeachEvent extends Action {
  key: Schema.EntityId;
  data: {
    id: Schema.EntityId;
    name: string;
    description: string;
    time: {
      start: Date;
      end: Date;
    },
    meta: {
      tag: string;
    }
  };
}

export interface DeleteTeachEvent extends Action {
  key: Schema.EntityId;
}
export interface ClearEntities extends Action {}

export interface UpdateTeachEventArgs {
  name: string;
  description: string;
  time: {
    start: Date;
    end: Date;
  }
}

export interface SetParticipant extends Action {
  key: Schema.EntityId;
  data: {
    participant: Schema.EntityId;
  }
}

export interface RemoveParticipant extends SetParticipant {};
