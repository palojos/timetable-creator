/*
Describes schema used in store

All relevant interfaces and constants are exported and can be imported by
import { Schema } from '@app/store'
*/

export interface Store {
  auth: Auth;
  entities: Entities;
}

export interface Entities {
  teachers: Teachers
  rooms: Rooms
  groups: Groups
  events: Events
}

export type Events = {[id: string]: TeachEvent}
export type Groups = {[id: string]: Group};
export type Rooms = {[id: string]: Room};
export type Teachers = {[id: string]: Teacher};


export interface Teacher {
  id: EntityId;
  name: string;
}

export interface Room {
  id: EntityId
  name: string;
  capacity: number;
}

export interface Group {
  id: EntityId
  name: string;
  size: number;
}

export interface TeachEvent {
  id: EntityId
  name: string;
  time: EventTime;
  participants: Participant[]
}

export interface EventTime {
  start: Date;
  end: Date;
}

export interface Participant {
  type: ParticipantType;
  id: EntityId;
}

export type EntityId = string;

export type ParticipantType = "TEACHER" | "GROUP" | "ROOM";

export const ParticipantType: {[propName: string]: ParticipantType} = {
  TEACHER: "TEACHER",
  GROUP: "GROUP",
  ROOM: "ROOM"
}

export interface Auth {
  access_token: Token;
  acquired_time?: Date;
  expires_in?: number | null;
  type?: Bearer;
}

export type Bearer = "Bearer";
export type Token = string | null;

export const Bearer = "Bearer"
