import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Row, Col } from 'reactstrap';

import { Schema } from '@app/store';

import { ViewToolbar } from './ViewToolbar';
import { CalendarSelector } from './CalendarSelector';
import { Events } from './Events';


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
    </React.Fragment>
  );
}

const Dashboard = connect(mapStateToProps)(DashboardView);

export { Dashboard };
