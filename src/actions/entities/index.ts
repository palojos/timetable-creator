import { ActionEntities } from '@app/actions/actionConstants';

export function clearEntities() {
  return {
    type: ActionEntities.CLEAR_ENTITIES
  }
}

export function clearEvents() {
  return {
    type: "CLEAR_EVENTS"
  }
}

export * from './calendar';
export * from './event';
export * from './fetch'
