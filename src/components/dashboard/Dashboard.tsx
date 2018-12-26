import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


import { filters } from '@app/actions';
import { Schema } from '@app/store';
import { flow, sortBy, filter, map, values, uniq, includes } from 'lodash/fp';

const calendarsToList: (type: Schema.CalendarType) =>
                        (calendars: Schema.Calendars) =>
                          Schema.Calendar[] =
  (type: Schema.CalendarType) =>
    flow(
      values,
      filter( (c: Schema.Calendar) => c.meta.type == type),
      sortBy( (c: Schema.Calendar) => c.name ),
    );

const filterSelected: (rules: Schema.CalendarFilter[]) =>
                        (calnedars: Schema.Calendar[]) =>
                          Schema.Calendar[] =
  (rules: Schema.CalendarFilter[]) => {

    const include: any = flow(filter((r: Schema.CalendarFilter) => r.type == "INCLUDE"), map( (r: Schema.CalendarFilter) => r.entity), uniq)(rules);

    return filter((c: Schema.Calendar) => includes(c.id)(include));
  }

const mapStateToProps = (state: Schema.Store) => {

  const f = filterSelected(state.filters.calendar);

  const teachers = calendarsToList(Schema.CalendarType.TEACHER)(state.entities.calendars);
  const groups = calendarsToList(Schema.CalendarType.GROUP)(state.entities.calendars);
  const rooms = calendarsToList(Schema.CalendarType.ROOM)(state.entities.calendars);

  return {
    teachers,
    groups,
    rooms,
    selectedTeachers: f(teachers),
    selectedGroups:   f(groups),
    selectedRooms:    f(rooms),
    loading: state.status.global.loading,
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    clearSelected: () => dispatch(filters.calendar.clearCalendarFilters()),
    selectCalendar: (calendar: Schema.Calendar) => dispatch(filters.calendar.createIncludeFilter(calendar.id)),
    deselectCalendar: (calendar: Schema.Calendar) => dispatch(filters.calendar.removeIncludeFilter(calendar.id)),
  }
}

const DashboardView = (props: any) => {
  return props.loading ? (<Redirect to='/' />) : (
      <div className="row">
        <div className="col-4">
          <CalendarList
            title="Teachers"
            createLink="/create/calendar/teacher"
            calendars={props.teachers}
            selected={props.selectedTeachers}
            select={props.selectCalendar}
            deselect={props.deselectCalendar}
            history={props.history}
          />
          <CalendarList
            title="Groups"
            createLink="/create/calendar/groups"
            calendars={props.groups}
            selected={props.selectedGroups}
            select={props.selectCalendar}
            deselect={props.deselectCalendar}
            history={props.history}
          />
          <CalendarList
            title="Rooms"
            createLink="/create/calendar/rooms"
            calendars={props.rooms}
            selected={props.selectedRooms}
            select={props.selectCalendar}
            deselect={props.deselectCalendar}
            history={props.history}
          />
        </div>
      </div>
  );
}

interface CalendarListProps {
  title: string;
  createLink: string;
  calendars: Schema.Calendar[];
  selected: Schema.Calendar[];
  select: (calendar: Schema.Calendar) => void;
  deselect: (calendar: Schema.Calendar) => void;
  history: any;
}

const CalendarList = (props: CalendarListProps) => {

  const handleClick = (e: any) => {
    e.preventDefault();
    props.history.push(props.createLink);
  }

  const items = props.calendars.map((c: Schema.Calendar) => {
    const selected = includes(c)(props.selected);
    return( <CalendarListItem key={c.id} calendar={c} isSelected={selected} onClickAction={selected ? props.deselect : props.select} /> );
  });

  return(
    <div className="card mb-2" style={{width: "100%" }}>
      <div className="card-header">
        <h5 className="card-title">{props.title}
        <button className="btn btn-secondary float-right" onClick={handleClick}>
          <FontAwesomeIcon icon="plus" />
        </button></h5>
      </div>
      <ul className="list-group list-group-flush">
        {items}
      </ul>
    </div>
  );
}

interface CalendarListItemProps {
  calendar: Schema.Calendar;
  isSelected: boolean;
  onClickAction: (calendar: Schema.Calendar) => void;
}

const CalendarListItem = (props: CalendarListItemProps) => {

  const handleClick = (e: any) => {
    e.preventDefault();
    props.onClickAction(props.calendar);
  }

  return(
    <li className={props.isSelected ? "list-group-item active" : "list-group-item"} >
      { props.calendar.name }
      <button className="btn btn-primary float-right" onClick={handleClick}>{props.isSelected ? "deselect" : "select"}</button>
    </li>
  );
}


const Dashboard = connect(mapStateToProps, mapDispatchToProps)(DashboardView);

export { Dashboard };
