/*
Assigner wrapper
*/
import { assign } from 'lodash/fp';

interface assigner {
  (source:any): any
}

export default function<T>(state: T): (source: T) => T {
  return assign(assign({})(state))
}
