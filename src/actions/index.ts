
import {
  Action as ActionStrict,
  ActionFilter,
  ActionEntities,
  ActionType,
  ActionEventParticipants,
  ActionApi,
  ActionResource
} from './actionConstants';

//Loose Action interface for general use
export interface Action extends ActionStrict {
  [propName: string]: any;
}

export { ActionFilter, ActionEntities, ActionType, ActionEventParticipants, ActionApi, ActionResource};

import * as filters from './filters';
import * as entities from './entities';
import * as api from './api';

export { filters, entities, api };

