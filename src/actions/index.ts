
//Export action constants under Actions namespace
import {
  Action as ActionStrict,
  ActionFilter,
  ActionType
} from './actionConstants';

//Loose Action interface for general use
export interface Action extends ActionStrict {
  [propName: string]: any
}

export { ActionFilter, ActionType }
