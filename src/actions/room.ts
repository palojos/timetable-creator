/*
Room actions
*/

import { Action, ActionType as Type } from './actionConstants';

interface IaddRoom extends Action {
  name: string;
  capacity: number;
}

export function addRoom (name: string, capacity: number): IaddRoom {
  return {
    type: Type.ADD_ROOM,
    name,
    capacity
  }
}
