import React from 'react';
import { Link } from 'react-router-dom';

import { Schema } from '@app/store';

import { VisibleCalendarList } from './CalendarList';

export class Dashboard extends React.Component {

  constructor(props: {}) {
    super(props);
  }

  render() {
    return (
      <div>
        <h1>Dashboard</h1>
        <Link to="/create/calendar/teacher">Create Teacher</Link>
        <Link to="/create/calendar/room">Create Room </Link>
        <Link to="/create/calendar/group">Create Group</Link>

        <h2>Calendars</h2>
        <div>
          <h3>Teachers</h3>
          <VisibleCalendarList
            calendarType={Schema.CalendarType.TEACHER}
          />
        </div>

        <div>
          <h3>Groups</h3>
          <VisibleCalendarList
            calendarType={Schema.CalendarType.GROUP}
          />
        </div>

        <div>
          <h3>Rooms</h3>
          <VisibleCalendarList
            calendarType={Schema.CalendarType.ROOM}
          />
        </div>

      </div>
    );
  }
}
