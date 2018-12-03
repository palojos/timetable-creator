import React from 'react';
import { connect } from 'react-redux';
import { filter, values, sortBy, flow, map  } from 'lodash/fp';

import { Schema } from '@app/store';

const mapStateToProps = (state: Schema.Store) => {
  return {
    calendars: flow(values, sortBy((c: Schema.Calendar)=> c.name ))(state.entities.calendars),
    filter: state.filters.calendar
  }
}

interface CalendarListProps {
  calendars: Schema.Calendar[];
  filter: Schema.CalendarFilter[];
  calendarType: Schema.CalendarType;
}

class CalendarList extends React.Component <CalendarListProps, {}> {
  render() {
    const ListItems = flow(
    filter((c: Schema.Calendar) => {
      return c.meta.type == this.props.calendarType
    }),
    map((c: Schema.Calendar) => {
      c
      return (
        <CalendarListItem
          key={c.id}
          name={c.name}
          id={c.id}
        />
      );
    }))(this.props.calendars)
    return (
      <ul>
        {ListItems}
      </ul>
    );
  }
}

interface CalendarListItemProps {
  name: string;
  id: Schema.EntityId;
}

const CalendarListItem = (props: CalendarListItemProps) => {
  return (
    <li>
      { props.name }
    </li>
  );
}

const VisibleCalendarList = connect(mapStateToProps)(CalendarList);

export { VisibleCalendarList };
