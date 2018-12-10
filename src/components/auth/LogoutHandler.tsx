import React from 'react';
import { Redirect } from 'react-router-dom';


export const LogoutHandler = () => {

  window.localStorage['gapi:token'] = "";
  window.localStorage['gapi:expires_in'] = "";
  window.localStorage['gapi:acquired_at'] = "";

  return (
    <Redirect to="/" />
  );
}
