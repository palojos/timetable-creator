import React from 'react';
import { connect } from 'react-redux';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { Schema } from '@app/store';
import { ui } from '@app/actions';

import moment from 'moment';

const mapStateToProps = (state: Schema.Store) => {
  return {
    start: state.ui.view.start.clone(),
    end: state.ui.view.end.clone(),
  };
}

const mapDispatchToProps = (dispatch: any) => {

  return {
    nextWeek: (start: moment.Moment, end: moment.Moment) => {
      dispatch(ui.setView(start.add(1, 'w'), end.add(1, 'w')));
    },
    prevWeek: (start: moment.Moment, end: moment.Moment) => {
      dispatch(ui.setView(start.subtract(1, 'w'), end.subtract(1, 'w')));
    },
    nextMonth: (start: moment.Moment,) => {
      const s = start.add(1, 'M').isoWeekday(1);
      const e = s.clone().isoWeekday(5);
      dispatch(ui.setView(s, e));
    },
    prevMonth: (start: moment.Moment) => {
      const s = start.subtract(1, 'M').isoWeekday(1);
      const e = s.clone().isoWeekday(5);
      dispatch(ui.setView(s, e));
    },
  };
}


const ViewToolbarView = (props: any) => {

  const handleNextWeek = (e: any) => {
    e.preventDefault();
    props.nextWeek(props.start, props.end);
  }

  const handlePrevWeek = (e: any) => {
    e.preventDefault();
    props.prevWeek(props.start, props.end);
  }

  const handleNextMonth = (e: any) => {
    e.preventDefault();
    props.nextMonth(props.start);
  }

  const handlePrevMonth = (e: any) => {
    e.preventDefault();
    props.prevMonth(props.start);
  }

  return (
    <div className="btn-toolbar">
      <div className="btn-group mr-2">
        <button className="btn btn-secondary" onClick={handlePrevMonth}><FontAwesomeIcon icon="angle-double-left" /></button>
        <button className="btn btn-secondary" onClick={handlePrevWeek}><FontAwesomeIcon icon="angle-left"/></button>
      </div>
      <span className="font-weight-light">{props.start.format('dd DD/MM/YYYY') + ' - ' + props.end.format('dd DD/MM/YYYY')}</span>
      <div className="btn-group ml-2">
        <button className="btn btn-secondary" onClick={handleNextWeek}><FontAwesomeIcon icon="angle-right"/></button>
        <button className="btn btn-secondary" onClick={handleNextMonth}><FontAwesomeIcon icon="angle-double-right"/></button>
      </div>
    </div>
  );
}

const ViewToolbar = connect(mapStateToProps, mapDispatchToProps)(ViewToolbarView);

export { ViewToolbar };
