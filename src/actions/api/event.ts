import { Schema } from '@app/store';
import { ActionApi, Action } from '@app/actions';
import { Dispatch } from 'redux';
import { client, to } from '@app/actions/util';
import uuidv4 from 'uuid/v4';

export interface EventApiAction extends Action {
  key: Schema.EntityId;
  flags?: {
    [key: string]: boolean;
  }
  ref?: Schema.EntityId
}

export interface EventApiError extends EventApiAction {
  statusCode: string;
}

function getEventList
