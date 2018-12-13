import * as I from './interfaces';
import { Schema } from '@app/store';
import { ActionEntities, ActionEventParticipants } from '@app/actions/actionConstants';

import { join, forEach } from 'lodash/fp';

import uuidv4 from 'uuid/v4';

export function createTeachEvent(name: string, start: Date, end: Date, participants?: Schema.EntityId[]) {
  return function(dispatch: any) {
    const id = uuidv4();
    const tag = 'timetable-creator:[' + join('|')([ "TEACH_EVENT", name, id]) + ']';
    const createAction: I.CreateTeachEvent = {
      type: ActionEntities.CREATE_TEACH_EVENT,
      key: id,
      data: {
        id,
        name,
        description: "",
        owner: 
        meta: {
          tag,
        },
        time: {
          start,
          end
        },
        participants: []
      }
    };

    dispatch(createAction);

    const setAllParticipants = forEach((p: Schema.EntityId) => {
      dispatch(setParticipant(id, p));
    });

    if(participants) {
      setAllParticipants(participants);
    }
  }
}

export function updateTeachEvent(event: Schema.EntityId, args: I.UpdateTeachEventArgs): I.UpdateTeachEvent {

  const id = event;
  const tag = 'timetable-creator:[' + join('|')([ "TEACH_EVENT", args.name, id]) + ']';
  const data = {
    id,
    name: args.name,
    description: args.description,
    time: args.time,
    meta: {
      tag
    }
  }

  return {
    type: ActionEntities.UPDATE_TEACH_EVENT,
    key: event,
    data
  };
}

export function deleteTeachEvent(event: Schema.EntityId): I.DeleteTeachEvent {
  return {
    type: ActionEntities.DELETE_TEACH_EVENT,
    key: event
  }
}

export function setParticipant(event: Schema.EntityId, participant: Schema.EntityId): I.SetParticipant {
  return {
    type: ActionEventParticipants.SET_PARTICIPANT,
    key: event,
    data: {
      participant
    }
  };
}

export function removeParticipant(event: Schema.EntityId, participant: Schema.EntityId): I.RemoveParticipant {
    return {
    type: ActionEventParticipants.SET_PARTICIPANT,
    key: event,
    data: {
      participant
    }
  };
}
