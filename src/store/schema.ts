/*
Describes schema used in store

All relevant interfaces and constants are exported and can be imported by
import { Schema } from '@app/store'
*/

export interface Store {
  auth: Auth;
  entities: Entities;
  resources: {
    calendars: {
      id: EntityId;
      name: string;
      description: string;
      meta: {
        ref: string;
      }
    }[]
  }
  filters: Filters;
  status: {
    teachers: {[id:string]: EntityState}
    rooms: {[id:string]: EntityState}
    groups: {[id:string]: EntityState}
    events: {[id: string]: EntityState}
  }
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
    ref: string;
  }
  reserved: ReservedEvent[];
}

export interface TeachEvent {
  id: EntityId;
  name: string;
  description: string;
  meta: {
    tag: string;
    ref: string;
  }
  time: {
    start: Date;
    end: Date;
  }
  participants: EntityId[];
}

export interface ReservedEvent {
  id: EntityId;
  time: {
    start: Date;
    end: Date;
  }
  meta: {
    ref: string;
  }
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

export interface EntityState {
  id: EntityId;
  under_change: boolean;
  valid: boolean;
  status?: "CREATE" | "UPDATE" | "DELETE" | "FETCH";
  tokens: {
    fetch: string
  }
}
