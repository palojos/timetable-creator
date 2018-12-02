
import {
  Action as ActionStrict,
  ActionFilter,
  ActionEntities,
  ActionType,
  ActionEventParticipants
} from './actionConstants';

//Loose Action interface for general use
export interface Action extends ActionStrict {
  [propName: string]: any
}

export { ActionFilter, ActionEntities, ActionType, ActionEventParticipants}

import * as filters from './filters';
import * as entities from './entities';

export { filters, entities };

