/*
All defined actions in application
*/

export const ADD_TEACHER = "ADD_TEACHER";
export const ADD_ROOM = "ADD_ROOM";
export const ADD_GROUP = "ADD_GROUP";

export const ADD_EVENT = "ADD_EVENT";
export const EDIT_EVENT = "EDIT_EVENT";
export const DELETE_EVENT = "DELETE_EVENT";

export const SET_AUTH_TOKEN = "SET_AUTH_TOKEN";
export const INVALIDATE_AUTH_TOKEN = "INVALIDATE_AUTH_TOKEN";

type ActionType =
    "ADD_TEACHER"
  | "ADD_ROOM"
  | "ADD_GROUP"
  | "ADD_EVENT"
  | "EDIT_EVENT"
  | "DELETE_EVENT"
  | "SET_AUTH_TOKEN"
  | "INVALIDATE_AUTH_TOKEN";

export interface Action {
  type: ActionType;

}
