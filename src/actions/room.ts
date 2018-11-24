/*
Room actions
*/

import { Schema } from '@app/store';
import { Action } from './actionConstants';
import { ADD_ROOM } from './actionConstants';

interface IaddRoom extends Action, Schema.Room {}

export function addRoom (name: string, capacity: number): IaddRoom {
  return {
    type: ADD_ROOM,
    name,
    capacity
  }
}
