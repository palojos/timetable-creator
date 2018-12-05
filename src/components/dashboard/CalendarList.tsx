import React from 'react';
import { connect } from 'react-redux';
import { filter, values, sortBy, flow, map  } from 'lodash/fp';

import { Schema } from '@app/store';

import { filters } from '@app/actions';

const mapStateToProps = (state: Schema.Store) => {
  return {
    calendars: flow(values, sortBy((c: Schema.Calendar)=> c.name ))(state.entities.calendars),
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    onSelectCalendar: (id: Schema.EntityId) => {
      dispatch(filters.calendar.createIncludeFilter(id));
    },
    onDeselectCalendar: (id: Schema.EntityId) => {
      dispatch(filters.calendar.removeIncludeFilter(id));
    },
    onMount: () => {
      dispatch(filters.calendar.clearCalendarFilters());
    }
  }
}

interface CalendarListProps {
  calendars: Schema.Calendar[];
  calendarType: Schema.CalendarType;
  onSelectCalendar: (id: Schema.EntityId) => void;
  onDeselectCalendar: (id: Schema.EntityId) => void;
  onMount: () => void;
}

class CalendarList extends React.Component <CalendarListProps, {}> {
  
  componentDidMount() {
    this.props.onMount()
  }

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
          onSelect={this.props.onSelectCalendar}
          onDeselect={this.props.onDeselectCalendar}
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
  onSelect: (id: Schema.EntityId) => void;
  onDeselect: (id: Schema.EntityId) => void;
}

interface CalendarListItemState {
  selected: boolean;
}

/*
const CalendarListItem = (props: CalendarListItemProps) => {
  return (
    <li>
      { props.name }
    </li>
  );
}
*/

class CalendarListItem extends React.Component <CalendarListItemProps, CalendarListItemState> {

  constructor(props: CalendarListItemProps) {
    super(props);
    this.state = {selected: false};

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e: any) {
    e.preventDefault()
    this.setState((prev) => {
      return { selected: !prev.selected };
    }, () => {
      this.state.selected ? this.props.onSelect(this.props.id) : this.props.onDeselect(this.props.id);
    });
  }

  render() {

    return (
      <li onClick={this.handleClick}>
        { this.props.name }
      </li>
    );
  }
}

const VisibleCalendarList = connect(mapStateToProps, mapDispatchToProps)(CalendarList);

export { VisibleCalendarList };
