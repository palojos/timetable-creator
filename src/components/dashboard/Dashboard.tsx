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

        <div>
          <h2>Teachers</h2>
          <VisibleCalendarList
            calendarType={Schema.CalendarType.TEACHER}
          />
        </div>

        <div>
          <h2>Groups</h2>
          <VisibleCalendarList
            calendarType={Schema.CalendarType.GROUP}
          />
        </div>

        <div>
          <h2>Rooms</h2>
          <VisibleCalendarList
            calendarType={Schema.CalendarType.ROOM}
          />
        </div>

        <div>
          <Link to="/auth/logout"> Logout </Link>
        </div>

      </div>
    );
  }
}
