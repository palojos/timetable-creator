/*
Teacher actions
*/

import { Schema } from '@app/store';
import { Action } from './actionConstants';
import { ADD_TEACHER } from './actionConstants';

interface IaddTeacher extends Action {
  name: string;
}

export function addTeacher(name: string): IaddTeacher {
  return {
    type: ADD_TEACHER,
    name
  }
}
