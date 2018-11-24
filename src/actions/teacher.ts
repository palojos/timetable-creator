/*
Teacher actions
*/

import { Schema } from '@app/store';
import { Action } from './actionConstants';
import { ADD_TEACHER } from './actionConstants';

interface IaddTeacher extends Action, Schema.Teacher {}

export function addTeacher(name: string): IaddTeacher {
  return {
    type: ADD_TEACHER,
    name
  }
}
