/*
Teacher actions
*/

import { Action, ActionType as Type } from './actionConstants';

interface IaddTeacher extends Action {
  name: string;
}

export function addTeacher(name: string): IaddTeacher {
  return {
    type: Type.ADD_TEACHER,
    name
  }
}
