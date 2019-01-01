import React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Badge, ListGroupItem, ListGroup} from 'reactstrap';
import { Link } from 'react-router-dom';
import moment from 'moment';
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { flow, filter, values, includes, sortBy, map, union, capitalize } from 'lodash/fp';

import { Schema } from '@app/store';
import { entities } from '@app/actions';

export interface Event {
  id: string;
  name: string;
  start: moment.Moment;
  end: moment.Moment;
  room?: Schema.Calendar;
  group?: Schema.Calendar;
  teacher?: Schema.Calendar;
  owner?: Schema.Calendar
}

const mapStateToProps = (state: Schema.Store) => {
  const events: Event[] = flow(
    values,
    filter((e: Schema.TeachEvent) => moment(e.time.start).isSameOrAfter(state.ui.view.start, 'day')),
    filter((e: Schema.TeachEvent) => moment(e.time.start).isSameOrBefore(state.ui.view.end, 'day')),
    filter((e: Schema.TeachEvent) => state.ui.teacher ? includes(state.ui.teacher)(e.participants) : true),
    filter((e: Schema.TeachEvent) => state.ui.group ? includes(state.ui.group)(e.participants) : true),
    filter((e: Schema.TeachEvent) => state.ui.room ? includes(state.ui.room)(e.participants) : true),
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
    filter((e: Schema.EventResource) => moment(e.time.start).isSameOrAfter(state.ui.view.start, 'day')),
    filter((e: Schema.EventResource) => moment(e.time.start).isSameOrBefore(state.ui.view.end, 'day')),
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
  )(state.resources.events)

  const u = union(events)(resources);
  console.log(u);

  return {
    events: u.length !== 0 ? sortBy((e: Event) => e.start.valueOf())(u) : [],
    filters: {
      isTeacher: state.ui.teacher !== undefined,
      isGroup: state.ui.group !== undefined,
      isRoom: state.ui.room !== undefined,
    },
    start: state.ui.view.start.clone(),
    end: state.ui.view.end.clone(),
  };

}

const mapDispatchToProps = (dispatch: any) => {
  return {
    deleteEvent: (e: Event) => {
      dispatch(entities.deleteTeachEvent(e.id, {
        name: e.name,
        start: e.start.format(),
        end: e.end.format(),
        group: e.group ? e.group : {id: "", name: "", description: "", meta: {type: "GROUP", tag: ""}},
        teacher: e.teacher ? e.teacher : {id: "", name: "", description: "", meta: {type: "GROUP", tag: ""}},
        room: e.room ? e.room : {id: "", name: "", description: "", meta: {type: "GROUP", tag: ""}},
      }));
    }
  }
}

const EventsView = (props: any) => {

  const times: moment.Moment[] = [];
  let tmp: moment.Moment = props.start.clone();
  while(!tmp.isAfter(props.end, 'day')) {
    times.push(tmp);
    tmp = tmp.clone().add(1, 'day');
  }

  const Items = times.map((t: moment.Moment) => {
    return(
      <DayView
        key={t.valueOf()}
        events={props.events}
        time={t}
        deleteAction={props.deleteEvent}
      />
    );
  });

  return(
    <Row>
      {Items}
    </Row>
  );
}

const Events = connect(mapStateToProps, mapDispatchToProps)(EventsView);

export { Events };

interface DayViewProps {
  events: Event[];
  time: moment.Moment;
  deleteAction: (e:Event) => void;
}

const DayView = (props: DayViewProps) => {

  const Items = filter((e: Event) => e.start.isSame(props.time, 'day'))(props.events).map((e: Event) => {
    return(
      <EventView
        key={e.id}
        event={e}
        deleteAction={props.deleteAction}
      />
    );
  });

  return(
      <Col>
        <h4>{props.time.format("ddd DD.MM.YYYY")}
          <Link to={"/dashboard/create/event/" + props.time.format("YYYY/MM/DD")} className="btn btn-secondary ml-3">Create</Link>
        </h4>
        <ListGroup>
          {Items}
        </ListGroup>
      </Col>
  )
}

interface EventViewProps {
  event: Event;
  deleteAction: (e:Event) => void;
}

const EventView = (props: EventViewProps) => {

  const handleOnDelete = (e: any) => {
    e.preventDefault();
    props.deleteAction(props.event);
  }

  return props.event.owner ? (
    <ListGroupItem>
    <h6> Reserved <Badge color="primary" className="float-right"> {props.event.start.format('HH:mm-') + props.event.end.format('HH:mm')} </Badge></h6>
    <span>Owner: {props.event.owner.name}</span><span className="float-right">Role: {capitalize(props.event.owner.meta.type)}</span>
    </ListGroupItem>
  ) : (
    <ListGroupItem>
    <h6> {props.event.name} <Badge color="primary" className="float-right"> {props.event.start.format('HH:mm-') + props.event.end.format('HH:mm')} </Badge></h6>
    <span>Teacher: {props.event.teacher ? props.event.teacher.name : "Not defined"}</span><br />
    <span>Group: {props.event.group ? props.event.group.name : "Not defined"}</span><br />
    <span>Room: {props.event.room ? props.event.room.name : "Not defined"}</span><br />
    <button className="btn btn-primary" onClick={handleOnDelete}>Remove</button>
    </ListGroupItem>
  );
}

