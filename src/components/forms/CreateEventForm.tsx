import React from 'react';
import {Row, Col, Alert, Form, FormGroup, Label, Input, FormText, ListGroup, ListGroupItem, Button, Badge} from 'reactstrap';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import memoize from 'memoize-one';

import { flow, values, filter, sortBy, map, includes, union, reduce, find, capitalize} from 'lodash/fp';

import { Schema } from '@app/store';
import { ui, entities } from '@app/actions';

import { Event } from '@app/components/dashboard/Events';

interface CreateEventFormProps extends RouteComponentProps<any> {}

interface CreateEvent {
  name: string;
  start: moment.Moment;
  end: moment.Moment;
  teacher: Schema.Calendar[];
  room: Schema.Calendar;
  group: Schema.Calendar[];
}

function parseMoment(obj: {year: string, month: string, day: string}): moment.Moment {
  return moment(obj.year + '-' + obj.month + '-' + obj.day, "YYYY-MM-DD");
}

const mapStateToProps = (state: Schema.Store, props: CreateEventFormProps) => {

  const time = parseMoment(props.match.params);

  const events = flow(
    values,
    filter((e: Schema.TeachEvent) => moment(e.time.start).isSame(time, 'day') || moment(e.time.end).isSame(time, 'day')),
    map((e: Schema.TeachEvent) => {

      const participants = map((key: Schema.EntityId) => state.entities.calendars[key])(e.participants);

      const event: Event = {
        id: e.id,
        name: e.name,
        start: moment(e.time.start),
        end: moment(e.time.end),
        teacher: filter((c: Schema.Calendar) => c.meta.type === "TEACHER")(participants),
        group: filter((c: Schema.Calendar) => c.meta.type === "GROUP")(participants),
        room: filter((c: Schema.Calendar) => c.meta.type === "ROOM")(participants),
      };

      return event;
    }),
  )(state.entities.events);

  const resources = flow(
    values,
    filter((e: Schema.EventResource) => moment(e.time.start).isSame(time, 'day') || moment(e.time.end).isSame(time, 'day')),
    map((e: Schema.EventResource) => {

      const event: Event = {
        id: e.id,
        name: e.name,
        start: moment(e.time.start),
        end: moment(e.time.end),
        owner: state.entities.calendars[e.owner],
      };

      return event;
    }),
  )(state.resources.events);

  const f = (type: Schema.CalendarType) => flow(
    values,
    filter((c: Schema.Calendar) => c.meta.type === type)
    )(state.entities.calendars);

  const teachers = f("TEACHER");
  const groups = f("GROUP");
  const rooms = f("ROOM");

  return {
    events: flow(union(events), sortBy((e: Event) => e.start.valueOf()))(resources),
    time,
    teachers,
    groups,
    rooms,
    selectedGroup: state.ui.group ? state.entities.calendars[state.ui.group] : undefined,
    selectedRoom: state.ui.room ? state.entities.calendars[state.ui.room] : undefined,
    selectedTeacher: state.ui.teacher ? state.entities.calendars[state.ui.teacher] : undefined,
  };
}

const mapDispatchToProps = (dispatch: any, props: CreateEventFormProps) => {
  return {
    createEvent: (e: CreateEvent) => {
      dispatch(entities.createTeachEvent(props.history, {
        name: e.name,
        start: e.start.format(),
        end: e.end.format(),
        attendees: union(e.teacher)(union(e.group)([e.room])),
        room: e.room,
      }));
    },
    error: (message: string) => {
      dispatch(ui.error(message));
    },
  };
}

interface CreateEventFormViewProps {
  events: Event[];
  time: moment.Moment;
  teachers: Schema.Calendar[];
  groups: Schema.Calendar[];
  rooms: Schema.Calendar[];
  selectedGroup?: Schema.Calendar;
  selectedTeacher?: Schema.Calendar;
  selectedRoom?: Schema.Calendar;
  createEvent: (e: CreateEvent) => void;
  error: (message: string) => void;
}

interface CreateEventFormViewState {
  name: string;
  e_start: moment.Moment;
  e_end: moment.Moment;
  groups: Schema.Calendar[];
  teachers: Schema.Calendar[];
  room?: Schema.Calendar;
  isValid: {
    name: boolean;
    time: boolean;
    teacher: boolean;
    group: boolean;
    room: boolean;
    size: boolean;
  };
}

class CreateEventFormView extends React.Component<CreateEventFormViewProps, CreateEventFormViewState> {

  selectedCalendars = memoize(
    ( groups: Schema.Calendar[], teachers: Schema.Calendar[], room?: Schema.Calendar) => flow(
      union(groups),
      union(teachers),
    )(room ? [room] : [])
  )

  selectedEvents = memoize(
    (events: Event[], calendars: Schema.Calendar[]) => {
      const cal = map((c: Schema.Calendar) => c.id)(calendars);
      return filter(
        (e: Event) =>  e.owner ? includes(e.owner.id)(cal) : reduce((res: boolean, id: string) => {
          const next = res 
          || (e.room ? includes(id)(map((c: Schema.Calendar) => c.id)(e.room)) : false)
          || (e.group ? includes(id)(map((c: Schema.Calendar) => c.id)(e.group)) : false)
          || (e.teacher ? includes(id)(map((c: Schema.Calendar) => c.id)(e.teacher)) : false)
          return next;
        }, false)(cal)
      )(events);
    }
  );

  overlappedEvents = memoize(
    (start: moment.Moment, end: moment.Moment, events: Event[]) => filter((e: Event) => 
      !((start.isBefore(e.start) && end.isSameOrBefore(e.start)) || (start.isSameOrAfter(e.end) && end.isAfter(e.end)))
    )(events)
  );

  valid = memoize(
    (validator: {[key: string]: boolean}): boolean => flow(
      values,
      reduce((res: boolean, value: boolean) => res && value, true)
    )(validator)
  );

  groupSize = memoize(
    (groups: Schema.Calendar[]) => reduce((res: number, c: Schema.Calendar) => c.meta.size ? res + c.meta.size : res, 0)(groups)
  );

  unselectedTeachers = memoize(
    (selection: Schema.Calendar[], all: Schema.Calendar[]) => {
      const ids = map( (c:Schema.Calendar) => c.id)(selection);
      return filter((c: Schema.Calendar) => !includes(c.id)(ids))(all);
    }
  );

  unselectedGroups = memoize(
    (selection: Schema.Calendar[], all: Schema.Calendar[]) => {
      const ids = map( (c:Schema.Calendar) => c.id)(selection);
      return filter((c: Schema.Calendar) => !includes(c.id)(ids))(all);
    }
  );


  constructor(props: CreateEventFormViewProps) {
    super(props);

    const groups = this.props.selectedGroup ? [this.props.selectedGroup] : [];
    const teachers = this.props.selectedTeacher ? [this.props.selectedTeacher] : [];
    const room =  this.props.selectedRoom;

    this.state = {
      name: "",
      e_start: this.props.time.clone().hour(9),
      e_end: this.props.time.clone().hour(11),
      groups,
      teachers,
      room,
      isValid: {
        name: false,
        time: false,
        teacher: false,
        group: false,
        room: false,
        size: false,
      },
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.removeSelectedCalendar = this.removeSelectedCalendar.bind(this);
    this.addSelectedCalendar = this.addSelectedCalendar.bind(this);
  }

  componentDidMount() {
    this.validate();
  }

  validate() {

    const isNameValid = this.state.name.length > 0;
    const isRoomValid = this.state.room !== undefined;
    const isGroupValid = this.state.groups.length > 0;
    const isTeacherValid = this.state.teachers.length > 0;
    const isTimeValid = this.overlappedEvents(
      this.state.e_start, this.state.e_end, 
      this.selectedEvents(this.props.events, 
        this.selectedCalendars(this.state.groups, this.state.teachers, this.state.room)
      )
    ).length === 0 && this.state.e_start.isBefore(this.state.e_end);
    const roomSize = this.state.room ? this.state.room.meta.size : undefined;
    const isSizeValid = roomSize ? roomSize >= this.groupSize(this.state.groups) : true;

    this.setState({
      isValid: {
        name: isNameValid,
        time: isTimeValid,
        teacher: isTeacherValid,
        room: isRoomValid,
        group: isGroupValid,
        size: isSizeValid,
      },
    });
  }

  handleChange(e: any) {
    const target = e.target;
    let value = target.value;
    switch (target.name) {
      case "name":
        this.setState({name: value}, this.validate)
        break;
      case "start":
        const startTime = moment(target.value, "HH:mm");
        value = this.props.time.clone().hour(startTime.hour()).minute(startTime.minute());
        this.setState({e_start: value}, this.validate);
        break;
      case "end":
        const endTime = moment(target.value, "HH:mm");
        value = this.props.time.clone().hour(endTime.hour()).minute(endTime.minute());
        this.setState({e_end: value}, this.validate);
        break;
      case "room":
        value = find<Schema.Calendar>({id: value})(this.props.rooms);
        this.setState({room: value}, this.validate);
        break;
    }
  }

  removeSelectedCalendar(calendar: Schema.Calendar) {
    this.setState((prevState) => {
      switch (calendar.meta.type) {
        case "TEACHER":
          return {teachers: filter((c: Schema.Calendar) => c.id !== calendar.id)(prevState.teachers), groups: prevState.groups};
        case "GROUP":
          return {groups: filter((c: Schema.Calendar) => c.id !== calendar.id)(prevState.groups), teachers: prevState.teachers};
        default:
          return {teachers: prevState.teachers, groups: prevState.groups};
      }
    }, this.validate);
  }

  addSelectedCalendar(calendar: Schema.Calendar) {
    this.setState((prevState) => {
      switch (calendar.meta.type) {
        case "TEACHER":
          return {teachers: union([calendar])(prevState.teachers), groups: prevState.groups};
        case "GROUP":
          return {groups: union([calendar])(prevState.groups), teachers: prevState.teachers};
        default:
          return {teachers: prevState.teachers, groups: prevState.groups};
      }
    }, this.validate);
  }

  handleSubmit(e: any) {
    e.preventDefault();
    this.validate();
    if (this.valid(this.state.isValid)) {
      this.props.createEvent({
        name: this.state.name,
        start: this.state.e_start,
        end: this.state.e_end,
        group: this.state.groups,
        teacher: this.state.teachers,
        room: this.state.room ? this.state.room : {id: "", name:"", description: "", meta: {tag: "", type: "ROOM"}},
      })
    } else {
      this.props.error("Tried to create invalid event");
    }
  }

  render() {

    const s_events = this.selectedEvents(this.props.events, this.selectedCalendars(this.state.groups, this.state.teachers, this.state.room));
    const o_events = this.overlappedEvents(this.state.e_start, this.state.e_end, s_events);

    return (
      <Row>
        <Col>
          <hr />
          <h5> Create event on: {this.props.time.format('DD.MM.YYYY')} </h5>
          <Form onSubmit={this.handleSubmit}>
            <FormGroup>
              <Label for="name">Event name</Label>
              <Input type="text" name="name" id="name" value={this.state.name} onChange={this.handleChange} placeholder="type event name here" />
            </FormGroup>
            <FormGroup>
              <Label for="start">Event start time</Label>
              <Input type="time" name="start" id="start" value={this.state.e_start.format("HH:mm")} onChange={this.handleChange} />
            </FormGroup>
            <FormGroup>
              <Label for="end">Event end time</Label>
              <Input type="time" name="end" id="end" value={this.state.e_end.format("HH:mm")} onChange={this.handleChange} />
            </FormGroup>
            <MultiCalendarSelector
              title="Select teachers"
              name="teacher"
              selection={this.state.teachers}
              items={this.unselectedTeachers(this.state.teachers, this.props.teachers)}
              add={this.addSelectedCalendar}
              remove={this.removeSelectedCalendar}
            />
            <MultiCalendarSelector
              title="Select groups"
              name="group"
              selection={this.state.groups}
              items={this.unselectedGroups(this.state.groups, this.props.groups)}
              add={this.addSelectedCalendar}
              remove={this.removeSelectedCalendar}
            />
            <SingleCalendarSelector
              title="Select room"
              name="room"
              selection={this.state.room}
              items={this.props.rooms}
              onChange={this.handleChange}
            />
            <Input type="submit" value="Create event" className="btn btn-primary" />
          </Form>
        </Col>
        <Col>
          <hr/>
          <h5> Event validation status: </h5>
          {!this.state.isValid.name ? (<Alert color="warning">Event name must be defined</Alert>) : null}
          {!this.state.isValid.time ? (<Alert color="warning">Event must have valid time</Alert>) :null}
          {!this.state.isValid.teacher ? (<Alert color="warning">Please select least one teacher</Alert>) : null}
          {!this.state.isValid.group ? (<Alert color="warning">Please select least one group</Alert>) : null}
          {!this.state.isValid.room ? (<Alert color="warning">Please select room</Alert>) : null}
          {this.state.isValid.room && this.state.isValid.group && !this.state.isValid.size ? (<Alert color="warning">Room does not have enough capacity for groups</Alert>) : null}
        </Col>
        <Col>
          <hr />
          <h5> Events on date {this.props.time.format('DD.MM.YYYY')}</h5>
          <ListGroup>
            {
              s_events.map((event: Event) => {
                const ov = includes(event)(o_events);
                return event.owner ? (
                  <ListGroupItem key={event.id} color={ov ? "danger" : ""}>
                    <h6> Reserved <Badge color="primary" className="float-right"> {event.start.format('HH:mm-') + event.end.format('HH:mm')} </Badge></h6>
                    <span>Owner: {event.owner.name}</span><span className="float-right">Role: {capitalize(event.owner.meta.type)}</span>
                  </ListGroupItem>
                ) : (
                  <ListGroupItem key={event.id} color={ov ? "danger" : ""}>
                    <h6> {event.name} <Badge color="primary" className="float-right"> {event.start.format('HH:mm-') + event.end.format('HH:mm')} </Badge></h6>
                    {
                      event.teacher ? event.teacher.map((c: Schema.Calendar) => {
                        <div key={c.id}>{c.name}</div>
                      }) : null
                    }
                    {
                      event.group ? event.group.map((c: Schema.Calendar) => {
                        <div key={c.id}>{c.name}</div>
                      }) : null
                    }
                    {
                      event.room ? event.room.map((c: Schema.Calendar) => {
                        <div key={c.id}>{c.name}</div>
                      }) : null
                    }
                  </ListGroupItem>
                )
              })
            }
          </ListGroup>
        </Col>
      </Row>
    );
  }
}

export const CreateEventForm = connect(mapStateToProps, mapDispatchToProps)(CreateEventFormView);

interface SingleCalendarSelectorProps {
  title: string;
  name: string;
  selection?: Schema.Calendar;
  items: Schema.Calendar[];
  onChange: (e: any) => void;
}

const SingleCalendarSelector = (props: SingleCalendarSelectorProps) => {

  const value = props.selection ? props.selection.id : undefined;
  const size = props.selection ? props.selection.meta.size : undefined;
  return(
    <FormGroup>
      <Label for={props.name}>{props.title}</Label>
      <Input type="select" name={props.name} id={props.name} value={value ? value : "null"} onChange={props.onChange}>
        <option value={"null"}>-- Not selected --</option>
        {
          props.items.map((c: Schema.Calendar) => {
            return <option key={c.id} value={c.id}>{c.name}</option>
          })
        }
      </Input>
      {size ? (<FormText> Size: {size}</FormText>) : ""}
    </FormGroup>
  );
}

interface MultiCalendarSelectorProps {
  title: string;
  name: string;
  selection: Schema.Calendar[];
  items: Schema.Calendar[];
  add: (calendar: Schema.Calendar) => void;
  remove: (calendar: Schema.Calendar) => void;
}

interface MultiCalendarSelectorState {
  selected: string;
}

class MultiCalendarSelector extends React.Component<MultiCalendarSelectorProps, MultiCalendarSelectorState> {

  state: MultiCalendarSelectorState

  constructor(props: MultiCalendarSelectorProps) {
    super(props);

    this.state = {
      selected: "null",
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
  }

  handleChange(e: any) {
    const target = e.target;
    switch (target.name) {
      case this.props.name:
        this.setState({selected: target.value})
        break;
      default:
        break;
    };
  }

  handleAdd() {
    const selection: Schema.Calendar | undefined = find<Schema.Calendar>({id: this.state.selected})(this.props.items);
    if(selection) {
      this.props.add(selection);
    };
  }

  render() {
    return(
      <FormGroup>
        <Label for={this.props.name}>{this.props.title}</Label>
        <FormText>
          {this.props.selection.length > 0 ? (<h6>Selected:</h6>) : null}
          {
            this.props.selection.map((c: Schema.Calendar) => {
              return(<h6 key={c.id} className="mb-2">
                <Button color="secondary" className="btn-sm mr-3" onClick={()=>this.props.remove(c)}><FontAwesomeIcon icon="minus"/></Button>
                {c.name}
                {c.meta.size ? (<span className="text-muted ml-2"> Size: {c.meta.size}</span>): null} 
              </h6>)
            })
          }
        </FormText>
        <Input type="select" name={this.props.name} id={this.props.name} value={this.state.selected} onChange={this.handleChange}>
          <option value="null">-- Not Selected --</option>
          {
            this.props.items.map((c: Schema.Calendar) => {
              return(
                <option key={c.id} value={c.id}>{c.name}</option>
              )
            })
          }
        </Input>
        <Button color="secondary mt-1" onClick={this.handleAdd}><FontAwesomeIcon icon="plus"/></Button>
      </FormGroup>
    );
  }
}
