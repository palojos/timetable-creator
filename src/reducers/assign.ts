/*
Assigner wrapper
*/
import { assign } from 'lodash/fp';

export default function<T>(state: T): (source: T) => T {
  return assign(assign({})(state))
}
