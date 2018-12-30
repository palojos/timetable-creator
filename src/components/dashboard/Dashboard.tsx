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


const mapStateToProps = (state: Schema.Store) => {
  return {
    loading: state.status.global.loading,
  };
}

const DashboardView = (props: any) => {

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
