import { ActionEntities } from '@app/actions/actionConstants';

export function clearEntities() {
  return {
    type: ActionEntities.CLEAR_ENTITIES
  }
}

export * from './calendar';
export * from './event';
export * from './fetch'
