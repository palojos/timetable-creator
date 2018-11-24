/*
Group actions
*/

import { Schema } from '@app/store';
import { Action } from './actionConstants';
import { ADD_GROUP } from './actionConstants';

interface IaddGroup extends Action, Schema.Group {}

export function addGroup (name: string, size: number): IaddGroup {
  return {
    type: ADD_GROUP,
    name,
    size
  }
}
