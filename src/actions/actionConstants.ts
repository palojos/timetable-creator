/*
All defined actions in application
*/

export type ActionType =
    "ADD_TEACHER"
  | "ADD_ROOM"
  | "ADD_GROUP"
  | "ADD_EVENT"
  | "EDIT_EVENT"
  | "DELETE_EVENT"
  | "SET_AUTH_TOKEN"
  | "INVALIDATE_AUTH_TOKEN";

interface IActionType {
  [propName:string]: ActionType
}

export const ActionType: IActionType = {
  ADD_TEACHER: "ADD_TEACHER",
  ADD_ROOM: "ADD_ROOM",
  ADD_GROUP: "ADD_GROUP",

  ADD_EVENT: "ADD_EVENT",
  EDIT_EVENT: "EDIT_EVENT",
  DELETE_EVENT:"DELETE_EVENT",

  SET_AUTH_TOKEN: "SET_AUTH_TOKEN",
  INVALIDATE_AUTH_TOKEN: "INVALIDATE_AUTH_TOKEN"
}

export interface Action {
  type: ActionType;
}
