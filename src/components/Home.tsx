import React from 'react';

import { Redirect } from 'react-router-dom';

export const Home = () => {
  const token = window.localStorage['gapi:token']
  return (
    <div>
      { token ? (<Redirect to="/dashboard"/>) : (<Redirect to="/auth/login" />) }
    </div>
  );
}
