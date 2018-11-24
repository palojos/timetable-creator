
//Export auth action creators
export * from './auth';

//Export room action creators
export * from './room';

//Export teacher action creators
export * from './teacher';

//Export group action creators
export * from './group';

//Export event action creators
export * from './event';

//Export action constants under Actions namespace
import * as Constants from './actionConstants';

//Loose Action interface for general use
export interface Action extends Constants.Action {
  [propName: string]: any
}
export type ActionType = Constants.ActionType;
export const ActionType = Constants.ActionType;
