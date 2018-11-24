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
  teachers: {
    [id: string]: Teacher;
  }
  rooms: {
    [id: string]: Room;
  }
  groups: {
    [id: string]: Group;
  }
  events: {
    [id: string]: TeachEvent;
  }
}

export interface Teacher {
  name: string;
}

export interface Room {
  name: string;
  capacity: number;
}

export interface Group {
  name: string;
  size: number;
}

export interface TeachEvent {
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
  id: string;
}

export type ParticipantType = "TEACHER" | "GROUP" | "ROOM";

export const participantTypes = {
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
