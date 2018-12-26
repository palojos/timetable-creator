import React from 'react';
import { Switch, Route, Redirect } from 'react-router';

import { Dashboard } from '@app/components/dashboard';
import { LoginForm, LoginHandler, LogoutHandler } from '@app/components/auth';
import { CalendarForm } from '@app/components/forms';
import { Home } from '@app/components/Home';
import { EventForm } from '@app/components/forms';

export let App = () => {
  return(
    <div className="container">
    <div className="row">
      <header className="col-12">
      <h1> Timetable creator </h1>
      </header>
    </div>
    <Switch>
      <Route exact path='/' component={Home} />

      <Route path='/dashboard' component={Dashboard} />
      <Route path='/loading' component={LoadHandler} />

      <Route path='/auth/login' component={LoginForm} />
      <Route path='/auth/success' component={LoginHandler} />
      <Route path='/auth/logout' component={LogoutHandler} />

      <Route path='/create/calendar/:type' component={CalendarForm} />

      <Route path='/create/event' component={EventForm} />
      {
      //<Route path='/update/event/:event_id' component={EventForm} />
      }
    </Switch>
    </div>
  );
}


import { Schema } from  '@app/store';
import { fetch } from '@app/actions/entities';
import { connect } from 'react-redux';

const mapStateToProps = (state: Schema.Store) => {
  return {
    status: state.status,
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    load: () => {
      dispatch(fetch());
    }
  };
}

class LoadHandlerA extends React.Component<any, any> {

  componentDidMount() {
    this.props.load();
  }

  render() {
    return(
      <div>
        { this.props.status.global.loading ? (<h2>Loading...</h2>) : (<Redirect to="dashboard" />) }
      </div>
      );
  }
}

const LoadHandler = connect(mapStateToProps, mapDispatchToProps)(LoadHandlerA);
