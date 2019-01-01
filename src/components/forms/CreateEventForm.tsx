import React from 'react';
import {Row, Col, Alert, Form, FormGroup, Label, Input, FormText, Badge, ListGroup, ListGroupItem} from 'reactstrap';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';

import { flow, values, filter, sortBy, map, includes, union, reduce, capitalize} from 'lodash/fp';

import { Schema } from '@app/store';
import { ui, entities } from '@app/actions';

import { Event } from '@app/components/dashboard/Events';

interface CreateEventFormProps extends RouteComponentProps<any> {}

interface CreateEvent {
  name: string;
  start: moment.Moment;
  end: moment.Moment;
  teacher: Schema.Calendar;
  room: Schema.Calendar;
  group: Schema.Calendar;
}

function parseMoment(obj: {year: string, month: string, day: string}): moment.Moment {
  return moment(obj.year + '-' + obj.month + '-' + obj.day, "YYYY-MM-DD");
}

const mapStateToProps = (state: Schema.Store, props: CreateEventFormProps) => {

  const time = parseMoment(props.match.params);

  const calendarsToList = (type: Schema.CalendarType): Schema.Calendar[] => {
    return flow(
      values,
      filter((c: Schema.Calendar) => c.meta.type === type),
      sortBy((c: Schema.Calendar) => c.name),
    )(state.entities.calendars)
  }

  const events = flow(
    values,
    filter((e: Schema.TeachEvent) => moment(e.time.start).isSame(time, 'day') || moment(e.time.end).isSame(time, 'day')),
    filter((e: Schema.TeachEvent) => state.ui.teacher ? includes(state.ui.teacher)(e.participants) : true || state.ui.group ? includes(state.ui.group)(e.participants) : true || state.ui.room ? includes(state.ui.room)(e.participants) : true),
    sortBy((e: Schema.TeachEvent) => moment(e.time.start).valueOf()),
    map((e: Schema.TeachEvent) => {

      const f = (type: Schema.CalendarType) => flow(
          map((key: Schema.EntityId) => state.entities.calendars[key]),
          filter((c: Schema.Calendar) => c.meta.type === type),
        )(e.participants)[0];

      const event: Event = {
        id: e.id,
        name: e.name,
        start: moment(e.time.start),
        end: moment(e.time.end),
        teacher: f("TEACHER"),
        group: f("GROUP"),
        room: f("ROOM"),
      };

     return event;
    }),
  )(state.entities.events);

  const resourceFilter = filter((e: Schema.EventResource) => {
    const cal = state.entities.calendars[e.owner]
    if(cal === undefined) return false;
    switch(cal.meta.type) {
      case "TEACHER":
        return state.ui.teacher ? state.ui.teacher === cal.id : false;
      case "GROUP":
        return state.ui.group ? state.ui.group === cal.id : false;
      case "ROOM":
        return state.ui.room ? state.ui.room === cal.id : false;
      default:
        return false;
    }
  });

  const resources: Event[] = flow(
    values,
    filter((e: Schema.EventResource) => moment(e.time.start).isSame(time, 'day')),
    resourceFilter,
    sortBy((e: Schema.EventResource) => moment(e.time.start).valueOf()),
    map((e: Schema.EventResource) => {
      const event: Event = {
        id: e.id,
        name: e.name,
        owner: state.entities.calendars[e.owner],
        start: moment(e.time.start),
        end: moment(e.time.end),
      };

      return event;
    }),
  )(state.resources.events);

  const teachers = calendarsToList("TEACHER");
  const rooms = calendarsToList("ROOM");
  const groups = calendarsToList("GROUP");

  const selectedTeacher = state.ui.teacher ? state.entities.calendars[state.ui.teacher] : undefined;
  const selectedGroup = state.ui.group ? state.entities.calendars[state.ui.group] : undefined;
  const selectedRoom = state.ui.room ? state.entities.calendars[state.ui.room] : undefined;

  const validRooms = selectedGroup ? filter((c: Schema.Calendar) => c.meta.size && selectedGroup.meta.size ? c.meta.size >= selectedGroup.meta.size : true )(rooms) : rooms;
  const validGroups = selectedRoom ? filter((c: Schema.Calendar) => c.meta.size && selectedRoom.meta.size ? c.meta.size <= selectedRoom.meta.size : true)(groups) : groups;

  const e = union(events)(resources);

  const isNameValid: boolean = state.ui.name.length > 0;

  const isTeacherValid: boolean = selectedTeacher !== undefined;
  const isGroupValid: boolean = selectedGroup !== undefined;
  const isRoomValid: boolean = selectedRoom !== undefined;
  const roomSize = selectedRoom ? selectedRoom.meta.size : undefined;
  const groupSize = selectedGroup ? selectedGroup.meta.size : undefined;
  const isSizeValid: boolean = roomSize && groupSize ? roomSize >= groupSize : false;

  const e_start = state.ui.e_start.clone();
  const e_end = state.ui.e_end.clone();

  const isStartTimeValid = filter((e: Event) => e.start.isSameOrBefore(e_start) && e.end.isAfter(e_start))(e).length === 0;

  const isEndTimeValid = filter((e: Event) => e.start.isBefore(e_end) && e.end.isSameOrAfter(e_end))(e).length === 0;

  const isTimeValid = e_start.isSameOrBefore(e_end);

  return {
    calendars: state.entities.calendars,
    teachers,
    groups,
    rooms,
    validRooms,
    validGroups,
    selectedTeacher,
    selectedGroup,
    selectedRoom,
    e_name: state.ui.name,
    events: e.length !== 0 ? sortBy((e: Event) => e.start.valueOf())(e) : [],
    time,
    e_start,
    e_end,
    valid: {
      e_name: isNameValid,
      teacher: isTeacherValid,
      group: isGroupValid,
      room: isRoomValid,
      size: isSizeValid,
      e_start: isStartTimeValid,
      e_end: isEndTimeValid,
      time: isTimeValid,
    },
  };
}

const mapDispatchToProps = (dispatch: any, props: CreateEventFormProps) => {

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
    setName: (name: string) => {
      dispatch(ui.setName(name));
    },
    setTime: (time: moment.Moment) => {
      props.history.replace('/dashboard/create/event/' + time.format('YYYY/MM/DD') );
      dispatch(ui.setView(time.clone().isoWeekday(1), time.clone().isoWeekday(5)));
    },
    error: (message: string) => {
      dispatch(ui.error(message));
    },
    createEvent: (event: CreateEvent) => {
      dispatch(entities.createTeachEvent(props.history, {
        name: event.name,
        start: event.start.format(),
        end: event.end.format(),
        teacher: event.teacher,
        group: event.group,
        room: event.room,
      }));
      dispatch(ui.clearPresets())
    },
    setEventStart: (time: moment.Moment) => {
      dispatch(ui.setEventStart(time));
    },
    setEventEnd: (time: moment.Moment) => {
      dispatch(ui.setEventEnd(time));
    },
  };
}

interface CreateEventFormViewState{
  showAlerts: boolean;
}

class CreateEventFormView extends React.Component<any, CreateEventFormViewState> {

  constructor(props: any) {
    super(props);

    this.state = {showAlerts: true}

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleSubmit(e: any) {
    e.preventDefault();
    const isValid = reduce((result:boolean, value: boolean) => {
      return result && value;
    }, true)(this.props.valid);
    if(!isValid) {
      this.props.error("Tried to create invalid event");
    } else {
      this.props.createEvent({
        name: this.props.e_name,
        start: this.props.e_start,
        end: this.props.e_end,
        teacher: this.props.selectedTeacher,
        group: this.props.selectedGroup,
        room: this.props.selectedRoom,
      });
    };
  }

  handleChange(e: any) {
    const target = e.target;
    switch (target.name) {
      case "name":
        this.props.setName(target.value);
        break;
      case "start":
        const startTime = moment(target.value, "HH:mm");
        const newStartTime = this.props.time.clone().hour(startTime.hour()).minute(startTime.minute());
        this.props.setEventStart(newStartTime);
        break;
      case "end":
        const endTime = moment(target.value, "HH:mm");
        const newEndTime = this.props.time.clone().hour(endTime.hour()).minute(endTime.minute());
        this.props.setEventEnd(newEndTime);
        break;
      case "teacher":
        this.props.selectTeacher(this.props.calendars[target.value]);
        break;
      case "group":
        this.props.selectGroup(this.props.calendars[target.value]);
        break;
      case "room":
        this.props.selectRoom(this.props.calendars[target.value]);
        break;
    }

  }

  componentWillMount() {
    this.props.setEventStart(this.props.time.clone().hour(8));
    this.props.setEventEnd(this.props.time.clone().hour(10));
  }

  render() {

  return(
    <Row>
    <Col>
      <hr />
      <h5> Create event on: <DateSelector time={this.props.time} setTime={this.props.setTime} /></h5>
      <Form onSubmit={this.handleSubmit}>
        <FormGroup>
          <Label for="name">Event name</Label>
          <Input type="text" name="name" id="name" value={this.props.e_name} onChange={this.handleChange} placeholder="type event name here" />
        </FormGroup>
        <FormGroup>
          <Label for="startTime">Event start time</Label>
          <Input type="time" name="start" id="startTime" value={this.props.e_start.format("HH:mm")} onChange={this.handleChange} />
        </FormGroup>
        <FormGroup>
          <Label for="endTime">Event end time</Label>
          <Input type="time" name="end" id="endTime" value={this.props.e_end.format("HH:mm")} onChange={this.handleChange} />
        </FormGroup>
        <CalendarSelector
          title="Teacher"
          name="teacher"
          selection={this.props.selectedTeacher}
          items={this.props.teachers}
          validItems={this.props.teachers}
          onChange={this.handleChange}
        />
        <CalendarSelector
          title="Group"
          name="group"
          selection={this.props.selectedGroup}
          items={this.props.groups}
          validItems={this.props.validGroups}
          onChange={this.handleChange}
        />
        <CalendarSelector
          title="Room"
          name="room"
          selection={this.props.selectedRoom}
          items={this.props.rooms}
          validItems={this.props.validRooms}
          onChange={this.handleChange}
        />
        <Input type="submit" value="Create event" className="btn btn-primary" />
      </Form>
      </Col>
      <Col>
        <hr/>
        <h5> Event validation status: </h5>
        {!this.props.valid.e_name ? (<Alert color="warning">Event name must be defined</Alert>) : ""}
        {!this.props.valid.e_start ? (<Alert color="warning">Event start time must not collide with another event</Alert>) : ""}
        {!this.props.valid.e_end ? (<Alert color="warning">Event end time must not collide with another event</Alert>): ""}
        {!this.props.valid.time ? (<Alert color="warning">Event start time must be before event end time</Alert>) : ""}
        {!this.props.valid.teacher ? (<Alert color="warning">Please select teacher</Alert>) : ""}
        {!this.props.valid.group ? (<Alert color="warning">Please select group</Alert>) : ""}
        {!this.props.valid.room ? (<Alert color="warning">Please select room</Alert>) : ""}
        {this.props.valid.room && this.props.valid.group && !this.props.valid.size ? (<Alert color="warning">Room does not have enough capacity for group</Alert>) : ""}
      </Col>
      <Col>
        <hr />
        <h5> Events on date {this.props.time.format('DD.MM.YYYY')}</h5>
        {this.props.selectedTeacher ? (<Badge color="primary" className="mr-1">Teacher: {this.props.selectedTeacher.name}</Badge>) : ""}
        {this.props.selectedGroup ? (<Badge color="primary" className="mr-1">Group: {this.props.selectedGroup.name}</Badge>) : ""}
        {this.props.selectedRoom ? (<Badge color="primary" className="mr-1">Room: {this.props.selectedRoom.name}</Badge>) : ""}
        <ListGroup>
        {
          this.props.events.map((event: Event) => {
            return event.owner ? (
              <ListGroupItem key={event.id}>
                <h6> Reserved <Badge color="primary" className="float-right"> {event.start.format('HH:mm-') + event.end.format('HH:mm')} </Badge></h6>
                <span>Owner: {event.owner.name}</span><span className="float-right">Role: {capitalize(event.owner.meta.type)}</span>
              </ListGroupItem>
              ) : (
              <ListGroupItem key={event.id}>
                <h6> {event.name} <Badge color="primary" className="float-right"> {event.start.format('HH:mm-') + event.end.format('HH:mm')} </Badge></h6>
                <span>Teacher: {event.teacher ? event.teacher.name : "Not defined"}</span><br />
                <span>Group: {event.group ? event.group.name : "Not defined"}</span><br />
                <span>Room: {event.room ? event.room.name : "Not defined"}</span><br />
              </ListGroupItem>
              );
          })
        }
        </ListGroup>
      </Col>
    </Row>
  );
  }
}

interface CalendarSelectorProps {
  items: Schema.Calendar[];
  validItems: Schema.Calendar[];
  title: string;
  name: string;
  selection?: Schema.Calendar;
  onChange: (e: any) => void;
}

const CalendarSelector = (props: CalendarSelectorProps) => {

  const value = props.selection ? props.selection.id : undefined;
  const size = props.selection ? props.selection.meta.size : undefined;
  return(
    <FormGroup>
      <Label for={props.name}>{props.title}</Label>
      <Input type="select" name={props.name} id={props.name} value={value ? value : "null"} onChange={props.onChange}>
        <option value={"null"}>-- Not selected --</option>
        {
          props.items.map((c: Schema.Calendar) => {
            return includes(c)(props.validItems) ? (
              <option key={c.id} value={c.id}>{c.name}</option>
              ) : (
              <option key={c.id} value={c.id} disabled>{c.name}</option>
              )
          })
        }
      </Input>
      {size ? (<FormText> Size: {size}</FormText>) : ""}
    </FormGroup>
  );
}

export const CreateEventForm = connect(mapStateToProps, mapDispatchToProps)(CreateEventFormView);

const DateSelector = (props: any) => {

  return(
    <span className="ml-2">
      <button onClick={() => props.setTime(props.time.subtract(1, 'week'))} className="btn btn-secondary mr-1" > <FontAwesomeIcon icon="angle-double-left" /> </button>
      <button onClick={() => props.setTime(props.time.subtract(1, 'days'))} className="btn btn-secondary mr-1" > <FontAwesomeIcon icon="angle-left" /> </button>
        {props.time.format('DD.MM.YYYY')}
      <button onClick={() => props.setTime(props.time.add(1, 'days'))} className="btn btn-secondary ml-1" > <FontAwesomeIcon icon="angle-right" /> </button>
      <button onClick={() => props.setTime(props.time.add(1, 'week'))} className="btn btn-secondary ml-1" > <FontAwesomeIcon icon="angle-double-right" /> </button>
    </span>
  );
}

