/*
All defined actions in application
*/

export type ActionApi =
    "FETCH_CALENDARS"          // Fetch calendars from server
  | "FETCH_CALENDARS_SUCCESS"  // Successfully fetched calendar
  | "FETCH_CALENDARS_ERROR"    // Error in fetching
  | "FETCH_EVENTS"             // Fetch events for particular calendar
  | "FETCH_EVENTS_SUCCESS"     // Successfully fetched events
  | "FETCH_EVENTS_ERROR"       // Failure in fetching of events
  | "CREATE_CALENDAR"          // Create new calendar to server
  | "CREATE_CALENDAR_SUCCESS"
  | "CREATE_CALENDAR_ERROR"
  | "UPDATE_CALENDAR"
  | "UPDATE_CALEDNAR_SUCCESS"
  | "UPDATE_CALENDAR_ERROR"
  | "CREATE_EVENT"
  | "CREATE_EVENT_SUCCESS"
  | "CREATE_EVENT_ERROR"
  | "UPDATE_EVENT"
  | "UPDATE_EVENT_SUCCESS"
  | "UPDATE_EVENT_ERROR"
  | "DELETE"
  | "DELETE_EVENT_SUCCESS"
  | "DELETE_EVENT_ERROR";

export type ActionAuth =
    "AUTH"                          // Starts authentication process
  | "AUTH_SUCCESS"                  // Authentication ended successfully
  | "AUTH_ERROR"                    // Authentication end to error
  | "VALIDATE_AUTH_TOKEN"           // Start authentication validation process
  | "VALIDATE_AUTH_TOKEN_SUCCESS"   // Successfully
  | "VALIDATE_AUTH_TOKEN_FAILURE"   // Auth token validation failed
  | "LOGIN"                         // Start login process, redirect browser to /login url
  | "ACQUIRE_TOKEN";                // Acquire token from url or local store

export type ActionApp =
    "CREATE_TEACHER"
  | "CREATE_TEACHER_SUCCESS"
  | "CREATE_TEACHER_ERROR"
  | "CREATE_GROUP"
  | "CREATE_GROUP_SUCCESS"
  | "CREATE_GROUP_ERROR"
  | "CREATE_ROOM"
  | "CREATE_ROOM_SUCCESS"
  | "CREATE_ROOM_ERROR"
  | "CREATE_TEACH_EVENT"
  | "CREATE_TEACH_EVENT_SUCCESS"
  | "CREATE_TEACH_EVENT_ERROR"
  | "UPDATE_TEACH_EVENT"
  | "UPDATE_TEACH_EVENT_SUCCES"
  | "UPDATE_TEACH_EVENT_ERROR"
  | "DELETE_TEACH_EVENT"
  | "DELETE_TEACH_EVENT_SUCCESS"
  | "DELETE_TEACH_EVENT_ERROR"
  | "UPDATE_INVALID_ENTITIES";

export type ActionFilter =
    "SET_CALENDAR_FILTER"
  | "SET_TIME_FILTER"
  | "REMOVE_CALENDAR_FILTER"
  | "REMOVE_TIME_FILTER"
  | "CLEAR_CALENDAR_FILTERS"
  | "CLEAR_TIME_FILTERS"

export const ActionFilter: {[keý: string]: ActionFilter} = {
  SET_CALENDAR_FILTER: "SET_CALENDAR_FILTER",
  SET_TIME_FILTER: "SET_TIME_FILTER",
  REMOVE_CALENDAR_FILTER: "REMOVE_CALENDAR_FILTER",
  REMOVE_TIME_FILTER: "REMOVE_TIME_FILTER",
  CLEAR_TIME_FILTERS: "CLEAR_TIME_FILTERS",
  CLEAR_CALENDAR_FILTERS: "CLEAR_CALENDAR_FILTERS"
}

export type ActionType = ActionApi | ActionAuth | ActionApp | ActionFilter;

export interface Action {
  type: ActionType;
}
