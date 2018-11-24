/*
Assigner wrapper for lodash/fp
*/
import { assign } from 'lodash/fp';

interface assigner {
  (source:any): any
}

export default function(state: any): assigner {
  return assign(assign({})(state))
}
