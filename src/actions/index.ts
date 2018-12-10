
import {
  Action as ActionStrict,
  ActionFilter,
  ActionEntities,
  ActionType,
  ActionEventParticipants,
  ActionApi
} from './actionConstants';

//Loose Action interface for general use
export interface Action extends ActionStrict {
  [propName: string]: any
}

export { ActionFilter, ActionEntities, ActionType, ActionEventParticipants, ActionApi}

import * as filters from './filters';
import * as entities from './entities';
import * as api from './api';

export { filters, entities, api };

