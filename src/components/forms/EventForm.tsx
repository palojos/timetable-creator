import React from 'react';
import { connect } from 'react-redux';

import { Schema } from '@app/store';
import { entities } from '@app/actions';

import {flow, filter, values, sortBy} from 'lodash/fp';

import moment from 'moment';

const mapStateToProps = (state: Schema.Store) => {

  const filterByType = (type: Schema.CalendarType):(calendars: Schema.Calendars) => Schema.Calendar[] => {
    return flow(
      values,
      filter((c: Schema.Calendar) => c.meta.type == type ),
      sortBy((c: Schema.Calendar) => c.name),
    );
  }

  return {
    calendars: state.entities.calendars,
    rooms: filterByType(Schema.CalendarType.ROOM)(state.entities.calendars),
    teachers: filterByType(Schema.CalendarType.TEACHER)(state.entities.calendars),
    groups: filterByType(Schema.CalendarType.GROUP)(state.entities.calendars),
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    createEvent: (params: entities.TeachEventParams) => {
      dispatch(entities.createTeachEvent(params));
    }
  }
}

interface IEventFormProps {
  rooms: Schema.Calendar[];
  teachers: Schema.Calendar[];
  groups: Schema.Calendar[];
  calendars: Schema.Calendars;
  createEvent: (params: entities.TeachEventParams) => void;
  history: any;
}

interface IEventFormState {
  name: string;
  startTime: string;
  endTime: string;
  teacher: Schema.EntityId;
  room: Schema.EntityId;
  group: Schema.EntityId;
}

class EventFormView extends React.Component<IEventFormProps, IEventFormState> {

  state: IEventFormState;
  constructor(props: IEventFormProps) {
    super(props);

    this.state = {
      name: "",
      startTime: moment().format(),
      endTime: moment().add(2, 'h').format(),
      teacher: this.props.teachers[0].id,
      room: this.props.rooms[0].id,
      group: this.props.groups[0].id,
    }

    this.onSubmit = this.onSubmit.bind(this);
    this.handleNameChange =  this.handleNameChange.bind(this);
    this.handleGroupChange = this.handleGroupChange.bind(this);
    this.handleRoomChange = this.handleRoomChange.bind(this);
    this.handleTeacherChange = this.handleTeacherChange.bind(this);
  };

  onSubmit(e: any) {
    e.preventDefault();
    const params: entities.TeachEventParams = {
      name: this.state.name,
      start: this.state.startTime,
      end: this.state.endTime,
      room: this.props.calendars[this.state.room],
      teacher: this.props.calendars[this.state.teacher],
      group: this.props.calendars[this.state.group],
    };

    this.props.createEvent(params);

  }

  handleTeacherChange(e: any) {
    e.preventDefault();
    this.setState({teacher: e.target.value});
  }

  handleRoomChange(e: any) {
    e.preventDefault();
    this.setState({room: e.target.value});
  }

  handleGroupChange(e: any) {
    e.preventDefault();
    this.setState({group: e.target.value});
  }

  handleNameChange(e: any) {
    e.preventDefault();
    this.setState({name: e.target.value});
  }

  render() {

    return(
      <form onSubmit={this.onSubmit}>
        <label>
          Select teacher:
          <SelectCalendar
            value={this.state.teacher}
            calendars={this.props.teachers}
            handler={this.handleTeacherChange}
           />
        </label>
        <label>
          Select group:
          <SelectCalendar
            value={this.state.group}
            calendars={this.props.groups}
            handler={this.handleGroupChange}
           />
        </label>
        <label>
          Select room:
          <SelectCalendar
            value={this.state.room}
            calendars={this.props.rooms}
            handler={this.handleRoomChange}
           />
        </label>
        <label>
          <input type="text" value={this.state.name} onChange={this.handleNameChange}/>
        </label>
        <input type="submit" value="Create Event" />
      </form>
    );
  }
}

interface ISelectCalendarProps {
  calendars: Schema.Calendar[];
  value: Schema.EntityId;
  handler: (e: any) => void;
}

const SelectCalendar = (props: ISelectCalendarProps) => {
  const Options = props.calendars.map( (c: Schema.Calendar) => {
    return(
      <option key={c.id} value={c.id}>{c.name}</option>
    );
  });
  return(
    <select value={props.value} onChange={props.handler} >
      {Options}
    </select>
  );
}


export const EventForm = connect(mapStateToProps, mapDispatchToProps)(EventFormView);
