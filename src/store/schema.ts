/*
Describes schema used in store

All relevant interfaces and constants are exported and can be imported by
import { Schema } from '@app/store'
*/

import moment from 'moment';

export interface Store {
  entities: Entities;
  resources: Resources;
  status: Status;
  ui: UIState;
}

export interface Entities {
  calendars: Calendars;
  events: Events;
}

export type Calendars = {[id: string]: Calendar}
export type Events = {[id: string]: TeachEvent}

export interface Calendar {
  id: EntityId;
  name: string;
  description: string;
  meta: {
    type: CalendarType;
    tag: string;
    size?: number;
  }
}

export interface TeachEvent extends EventResource {
  meta: {
    tag: string;
  }
}

export interface UIState {
  group?: EntityId;
  teacher?: EntityId;
  room?: EntityId;
  view: {
    start: moment.Moment;
    end: moment.Moment;
  };
  error: UIError[];
}

export interface UIError {
  id: string;
  message: string;
}

export type EntityId = string;
export type CalendarType = "TEACHER" | "GROUP" | "ROOM";

export const CalendarType: {[propName: string]: CalendarType} = {
  TEACHER: "TEACHER",
  GROUP: "GROUP",
  ROOM: "ROOM"
}

export interface Status {
    calendars: {[id:string]: EntityStatus};
    events: {[id: string]: EntityStatus};
    global: GlobalStatus;
    errors: Error[]
  }

export interface Error {
  id: EntityId;
  statusCode: number;
}

export interface EntityStatus {
  id: EntityId;
  status?: "POST" | "PUT" | "DELETE" | "GET" | "VALID";
}

export interface GlobalStatus {
  loading: boolean;
  updating: boolean;
}

export interface Resources {
  calendars: CalendarResources;
  events: EventResources;
}

export type CalendarResources = {[key: string]: CalendarResource}
export type EventResources = {[key: string]: EventResource}

export interface CalendarResource {
  id: EntityId;
  name: string;
  description: string;
}

export interface EventResource {
  id: EntityId;
  name: string;
  description: string;
  owner: EntityId;
  time: {
    start: string;
    end: string;
  }
  participants: EntityId[];
}
