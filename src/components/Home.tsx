import React from 'react';

import { Redirect } from 'react-router-dom';

export const Home = () => {
  let token = window.localStorage['gapi:token'];
  const acquired_time = new Date(window.localStorage['gapi:acquire_at']);
  const expires_in = window.localStorage['gapi:expires_in'];
  if (Date.now().valueOf() > acquired_time.valueOf() + expires_in * 100 ) {
    token = undefined;
  }
  return (
    <div>
      { token ? (<Redirect to="/loading"/>) : (<Redirect to="/auth/login" />) }
    </div>
  );
}
