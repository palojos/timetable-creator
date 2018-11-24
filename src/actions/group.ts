/*
Group actions
*/

import { Action, ActionType as Type } from './actionConstants';

interface IaddGroup extends Action {
  name: string,
  size: number
}

export function addGroup (name: string, size: number): IaddGroup {
  return {
    type: Type.ADD_GROUP,
    name,
    size
  }
}
