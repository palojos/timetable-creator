import React from 'react';
import { Switch, Route, Redirect, Link } from 'react-router-dom';
import { Container, Row, Col } from 'reactstrap';
import moment from 'moment';

import { Dashboard } from '@app/components/dashboard';
import { LoginForm, LoginHandler, LogoutHandler } from '@app/components/auth';
import { CalendarForm } from '@app/components/forms';
import { Home } from '@app/components/Home';
import { CreateEventForm } from '@app/components/forms';
import { Error } from '@app/components/Error';

export let App = () => {
  return(
    <Container fluid>
    <Row>
      <Col>
      <h1> Timetable creator </h1>
      </Col>
    </Row>
    <Error />
    <Switch>
      <Route exact path='/' component={Home} />

      <Route path='/dashboard' component={Dashboard} />
      <Route path='/loading' component={LoadHandler} />
      <Route path='/creating' component={Creator} />

      <Route path='/auth/login' component={LoginForm} />
      <Route path='/auth/success' component={LoginHandler} />
      <Route path='/auth/logout' component={LogoutHandler} />

      <Route path='/create/calendar/:type' component={CalendarForm} />
      <Route path='/create/event/:year/:month/:day' component={CreateEventForm} />
      { /*<Route path='/edit/event/:calendar/:id' component={EditEventForm} /> */ }
    </Switch>
    <Row>
      <Col>
        <hr />
        <Link className="btn btn-primary" to="/auth/logout">Logout</Link>
      </Col>
    </Row>
    </Container>
  );
}


import { Schema } from  '@app/store';
import { fetch } from '@app/actions/entities';
import { connect } from 'react-redux';

const mapStateToProps = (state: Schema.Store) => {
  return {
    status: state.status,
    start: state.ui.view.start,
    end: state.ui.view.end,
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    load: (start: moment.Moment, end: moment.Moment) => {
      dispatch(fetch(start, end));
    }
  };
}

class LoadHandlerA extends React.Component<any, any> {

  componentDidMount() {
    this.props.load(this.props.start, this.props.end);
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

const Creator = () => {
    return(
      <div>
        <h2>Creating.. </h2>
      </div>
    );
}
