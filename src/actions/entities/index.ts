import * as I from './interfaces';
import { ActionEntities } from '@app/actions/actionConstants';

export function clearEntities(): I.ClearEntities {
  return {
    type: ActionEntities.CLEAR_ENTITIES
  }
}

export * from './calendar';
export * from './events';
