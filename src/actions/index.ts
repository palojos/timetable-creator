
import {
  Action as ActionStrict,
  ActionUI,
  ActionEntities,
  ActionType,
  ActionApi,
  ActionResource
} from './actionConstants';

//Loose Action interface for general use
export interface Action extends ActionStrict {
  [propName: string]: any;
}

export { ActionUI, ActionEntities, ActionType, ActionApi, ActionResource};

import * as ui from './ui';
import * as entities from './entities';
import * as api from './api';

export { ui, entities, api };

