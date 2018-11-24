/*
Teach event actions
*/

import { Schema } from '@app/store';
import { Action, ActionType as Type } from './actionConstants';

interface IaddEvent extends Action {
  name: string;
  time: Schema.EventTime;
  participants: {
    teacher_id: Schema.EntityId;
    room_id: Schema.EntityId;
    group_id: Schema.EntityId;
  }
}

interface IeditEvent extends Action {
  event_id: Schema.EntityId;
  name?: string;
  time?: Schema.EventTime;
  participants: {
    teacher_id?: Schema.EntityId;
    room_id?: Schema.EntityId;
    group_id?: Schema.EntityId;
  }
}

interface IeditEventArgs {
  name?: string;
  time?: Schema.EventTime;
  participants: {
    teacher?: Schema.Teacher;
    room?: Schema.Room;
    group?: Schema.Group;
  }
}

interface IdeleteEvent extends Action {
  id: string
}

export function addEvent(name: string, time: Schema.EventTime, teacher: Schema.Teacher, room: Schema.Room, group: Schema.Group): IaddEvent {
  return {
    type: Type.ADD_EVENT,
    name,
    time,
    participants: {
      teacher_id: teacher.id,
      room_id: room.id,
      group_id: group.id
    }
  }
}

export function editEvent(event: Schema.TeachEvent, args: IeditEventArgs ): IeditEvent {
  if (args.participants) {
    return {
      type: Type.EDIT_EVENT,
      event_id: event.id,
      name: args.name ? args.name : undefined,
      time: args.time ? args.time : undefined,
      participants: {
        teacher_id: args.participants.teacher ? args.participants.teacher.id: undefined,
        room_id: args.participants.room ? args.participants.room.id : undefined,
        group_id: args.participants.group ? args.participants.group.id : undefined
      }
    }
  }
  else {
    return {
      type: Type.EDIT_EVENT,
      event_id: event.id,
      name: args.name ? args.name : undefined,
      time: args.time ? args.time : undefined,
      participants: {}
    }
  }
}

export function deleteEvent(event: Schema.TeachEvent): IdeleteEvent {
  return {
    type: Type.DELETE_EVENT,
    id: event.id
  }
}
