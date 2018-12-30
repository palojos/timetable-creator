import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Col, Row} from 'reactstrap';

import { flow, filter, values, sortBy } from 'lodash/fp';

import { Schema } from '@app/store';
import { ui } from '@app/actions';

const calendarsToList = (type: Schema.CalendarType, calendars: Schema.Calendars) => {

  return flow(
    values,
    filter((c: Schema.Calendar) => c.meta.type === type),
    sortBy((c: Schema.Calendar) => c.name)
  )(calendars);
}

const mapStateToProps = (state: Schema.Store) => {

  return {
    teachers:calendarsToList("TEACHER", state.entities.calendars),
    groups: calendarsToList("GROUP", state.entities.calendars),
    rooms: calendarsToList("ROOM", state.entities.calendars),
    selectedTeacher: state.ui.teacher ? state.entities.calendars[state.ui.teacher] : undefined,
    selectedGroup: state.ui.group ? state.entities.calendars[state.ui.group] : undefined,
    selectedRoom: state.ui.room ? state.entities.calendars[state.ui.room] : undefined,
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    selectTeacher: (calendar?: Schema.Calendar ) => {
      calendar ? dispatch(ui.selectOne(calendar)) : dispatch(ui.selectAll("TEACHER"));
    },
    selectGroup: (calendar?: Schema.Calendar ) => {
      calendar ? dispatch(ui.selectOne(calendar)) : dispatch(ui.selectAll("GROUP"));
    },
    selectRoom: (calendar?: Schema.Calendar ) => {
      calendar ? dispatch(ui.selectOne(calendar)) : dispatch(ui.selectAll("ROOM"));
    },
  };
}

const CalendarSelectorView = (props: any) => {

  return(
    <Row>
      <Col>
      <h4> Teacher <Link className="btn btn-secondary ml-2" to="/create/calendar/teacher"><FontAwesomeIcon icon="plus"/></Link></h4>
      <CalendarDropdown
        selectFunction={props.selectTeacher}
        items={props.teachers}
        selected={props.selectedTeacher}
      />
      </Col>
      <Col>
      <h4> Group <Link className="btn btn-secondary ml-2" to="/create/calendar/group"><FontAwesomeIcon icon="plus"/></Link></h4>
      <CalendarDropdown
        selectFunction={props.selectGroup}
        items={props.groups}
        selected={props.selectedGroup}
      />
      </Col>
      <Col>
      <h4> Room <Link className="btn btn-secondary ml-2" to="/create/calendar/room"><FontAwesomeIcon icon="plus"/></Link></h4>
      <CalendarDropdown
        selectFunction={props.selectRoom}
        items={props.rooms}
        selected={props.selectedRoom}
      />
      </Col>
    </Row>
  );

}

const CalendarSelector = connect(mapStateToProps, mapDispatchToProps)(CalendarSelectorView);
export { CalendarSelector };

interface CalendarDropdownProps {
  selectFunction: (calendar?: Schema.Calendar) => void;
  items: Schema.Calendar[];
  selected?: Schema.Calendar;
}

interface CalendarDropdownState {
  toggled: boolean;
}

class CalendarDropdown extends React.Component <CalendarDropdownProps, CalendarDropdownState> {

  constructor(props: CalendarDropdownProps) {
    super(props);

    this.state = {toggled: false};
    this.handleToggle = this.handleToggle.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }

  handleToggle() {
    this.setState((prevState) => {return {toggled: !prevState.toggled}});
  }

  handleSelect(calendar?: Schema.Calendar) {
      this.props.selectFunction(calendar);
  }

  render() {

    const Items = this.props.items.map((c: Schema.Calendar) => {
      return (
        <CalendarDropdownChoice
          key={c.id}
          calendar={c}
          onClick={this.handleSelect}
          isSelected={this.props.selected ? this.props.selected.id === c.id : false}
        />
        );
    });

    const selected = this.props.selected ? this.props.selected.name : "-- All --";

    const handleOnClick = (e: any) => {
      e.preventDefault();
      this.handleSelect();
    }

    const Container = (
      <DropdownMenu>
        <DropdownItem onClick={handleOnClick}>
          -- All --
        </DropdownItem>
        {Items}
      </DropdownMenu>
    );

    return(
      <Dropdown isOpen={this.state.toggled} toggle={this.handleToggle} >
        <DropdownToggle caret>
          { selected }
        </DropdownToggle>
        {Container}
      </Dropdown>
    );
  }
}

interface CalendarDropdownChoiceProps {
  calendar?: Schema.Calendar;
  onClick: (calendar?: Schema.Calendar) => void;
  isSelected: boolean;
}

const CalendarDropdownChoice = (props: CalendarDropdownChoiceProps) => {

  const handleOnClick = (e: any) => {
    e.preventDefault();
    props.onClick(props.calendar);
  }

  return(
    <DropdownItem onClick={handleOnClick}>
      {props.calendar ? props.calendar.name : "-- All --"}
    </DropdownItem>
  );
}
