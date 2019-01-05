import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Row, Col } from 'reactstrap';
import { Route } from 'react-router-dom';

import { Schema } from '@app/store';

import { ViewToolbar } from './ViewToolbar';
import { CalendarSelector } from './CalendarSelector';
import { Events } from './Events';
import { CreateEventForm } from '@app/components/forms'

import moment from 'moment';


const mapStateToProps = (state: Schema.Store) => {
  return {
    loading: state.status.global.loading,
  };
}

const DashboardView = (props: any) => {

  const expires_in = window.localStorage['gapi:expires_in'];
  const acquired_at = moment(window.localStorage['gapi:acquired_at']);

  const isExpired = moment().isSameOrAfter(acquired_at.add(expires_in, 'second'));

  if(isExpired) {
    props.history.push('/auth/logout');
  }

  return props.loading ? (<Redirect to="/"/>) : (
    <React.Fragment>
    <CalendarSelector />
    <hr/>
    <Row>
      <Col className="m-2">
        <ViewToolbar />
      </Col>
    </Row>
    <Events />
    <Row>
      <Col className="m-2">
        <ViewToolbar />
      </Col>
    </Row>
    <Route path='/dashboard/create/event/:year/:month/:day' component={CreateEventForm} />
    </React.Fragment>
  );
}

const Dashboard = connect(mapStateToProps)(DashboardView);

export { Dashboard };
