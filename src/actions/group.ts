/*
Group actions
*/

import { Action } from './actionConstants';
import { ADD_GROUP } from './actionConstants';

interface IaddGroup extends Action {
  name: string,
  size: number
}

export function addGroup (name: string, size: number): IaddGroup {
  return {
    type: ADD_GROUP,
    name,
    size
  }
}
