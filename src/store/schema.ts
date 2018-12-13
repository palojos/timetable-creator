/*
Describes schema used in store

All relevant interfaces and constants are exported and can be imported by
import { Schema } from '@app/store'
*/

export interface Store {
  entities: Entities;
  resources: Resources
  filters: Filters;
  status: Status;
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

export interface TeachEvent {
  id: EntityId;
  name: string;
  description: string;
  owner: EntityId;
  meta: {
    tag: string;
  }
  time: {
    start: string;
    end: string;
  }
  participants: EntityId[];
}

export type EntityId = string;
export type CalendarType = "TEACHER" | "GROUP" | "ROOM";

export const CalendarType: {[propName: string]: CalendarType} = {
  TEACHER: "TEACHER",
  GROUP: "GROUP",
  ROOM: "ROOM"
}

export interface Auth {
  access_token: Token;
  acquired_time?: Date;
  expires_in?: number;
  type?: Bearer;
}

export type Bearer = "Bearer";
export type Token = string | null;

export const Bearer = "Bearer";

export interface Filters {
  calendar: CalendarFilter[];
  time: TimeFilter[];
}

export interface CalendarFilter {
  type: CalendarFilterType;
  entity?: EntityId;
  calendarType?: CalendarType;
}

export type CalendarFilterType = "EXCLUDE" | "INCLUDE";

export interface TimeFilter {
  type: TimeFilterType;
  time: Date;
}

export type TimeFilterType = "AFTER" | "BEFORE";

export interface Status {
    calendars: {[id:string]: EntityStatus};
    events: {[id: string]: EntityStatus};
    global: GlobalStatus;
  }

export interface EntityStatus {
  id: EntityId;
  status?: "POST" | "PUT" | "DELETE" | "GET" | "VALID";
}

export interface GlobalStatus {
  isFetching: boolean;
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
    start: Date;
    end: Date;
  }
  participants: EntityId[];
}
