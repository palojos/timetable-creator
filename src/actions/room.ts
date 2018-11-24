/*
Room actions
*/

import { Action } from './actionConstants';
import { ADD_ROOM } from './actionConstants';

interface IaddRoom extends Action {
  name: string;
  capacity: number;
}

export function addRoom (name: string, capacity: number): IaddRoom {
  return {
    type: ADD_ROOM,
    name,
    capacity
  }
}
