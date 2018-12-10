import React from 'react';
import { Switch, Route } from 'react-router';

import { Dashboard } from '@app/components/dashboard';
import { LoginForm, LoginHandler, LogoutHandler } from '@app/components/auth';
import { CalendarForm } from '@app/components/forms';
import { Home } from '@app/components/Home';

export let App = () => {
  return(
    <Switch>
      <Route exact path='/dashboard' component={Dashboard} />

      <Route exact path='/' component={Home} />
      <Route path='/auth/login' component={LoginForm} />
      <Route path='/auth/success' component={LoginHandler} />
      <Route path='/auth/logout' component={LogoutHandler} />

      <Route path='/create/calendar/:type' component={CalendarForm} />
      {
      //<Route path='/create/event' component={EventForm} />
      //<Route path='/update/event/:event_id' component={EventForm} />
      }
    </Switch>
  );
}
