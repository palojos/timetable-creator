import React from 'react';
import { Switch, Route } from 'react-router';

import { Dashboard } from '@app/components/dashboard';

import { CalendarForm } from '@app/components/forms';

export let App = () => {
  return(
    <Switch>
      <Route exact path='/' component={Dashboard} />
      {
      //<Route exact path='/' component={Home} />
      //<Route path='/auth/login' component={AuthForm} />
      //<Route path='/auth/login/success' component={AuthHandler} />
      }
      <Route path='/create/calendar/:type' component={CalendarForm} />
      {
      //<Route path='/create/event' component={EventForm} />
      //<Route path='/update/event/:event_id' component={EventForm} />
      }
    </Switch>
  );
}
