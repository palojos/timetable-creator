/*
Event reducers
*/

import { Schema } from '@app/store';
import { Action, ActionType as Type } from '@app/actions';
import assign from './assign';

import uuidv4 from 'uuid/v4';

import filter from 'lodash/fp/filter';
import union from 'lodash/fp/union';
import flow from 'lodash/fp/flow';

export function events(state: Schema.Events = {}, action: Action): Schema.Events {
  switch (action.type) {
    case Type.ADD_EVENT:
      const id: Schema.EntityId = uuidv4();
      var participants: Schema.Participant[] = [
        {
          type: Schema.ParticipantType.TEACHER,
          id: action.participants.teacher_id
        },
        {
          type: Schema.ParticipantType.ROOM,
          id: action.participants.room_id
        },
        {
          type: Schema.ParticipantType.GROUP,
          id: action.participants.group_id
        }
      ];

      return assign<Schema.Events>(state)({
        id: {
          id,
          name: action.name,
          time: action.time,
          participants
        }
      });

    case Type.EDIT_EVENT:
      const event = state[action.event_id];
      var participants = event.participants;

      if(action.participants.teacher_id) {
        participants = flow(
          filter( (o: Schema.Participant) => {
            return o.type != Schema.ParticipantType.TEACHER
          }),
          union([{type: Schema.ParticipantType.TEACHER, id: action.participants.teacher_id}])
        )(participants);
      };

      if(action.participants.group_id) {
        participants = flow(
          filter( (o: Schema.Participant) => {
            return o.type != Schema.ParticipantType.GROUP
          }),
          union([{type: Schema.ParticipantType.GROUP, id: action.participants.group_id}])
        )(participants);
      }

      if(action.participants.room_id) {
        participants = flow(
          filter( (o: Schema.Participant) => {
            return o.type != Schema.ParticipantType.ROOM
          }),
          union([{type: Schema.ParticipantType.ROOM, id: action.participants.room_id}])
        )(participants);
      }

      return assign<Schema.Events>(state)({
        [action.event_id]: {
          id: action.event_id,
          name: action.name ? action.name : event.name,
          time: action.time ? action.time : event.time,
          participants
        }
      });

    case Type.DELETE_EVENT:
      delete state[action.event_id]
      return assign<Schema.Events>(state)({});

    default:
      return state;
  }
}
