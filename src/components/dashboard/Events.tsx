import React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Card, CardBody, CardTitle, CardSubtitle, ListGroup, ListGroupItem, CardFooter } from 'reactstrap';
import { Link } from 'react-router-dom';
import moment from 'moment';
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { flow, filter, values, includes, sortBy, map, union, capitalize } from 'lodash/fp';

import { Schema } from '@app/store';
import { entities } from '@app/actions';

interface Event {
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
        group: e.group,
        teacher: e.teacher,
        room: e.room,
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
        <h3>{props.time.format("ddd DD.MM.YYYY")}
          <Link to={"/create/event/" + props.time.format("YYYY/MM/DD")} className="btn btn-secondary ml-2">Create</Link>
        </h3>
          {Items}
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

  return (
  <Card>
    <CardBody>
      <CardTitle>{props.event.owner ? "Reserved" : props.event.name}</CardTitle>
      <CardSubtitle>{props.event.start.format("HH:mm") + " - " + props.event.end.format("HH:mm")}</CardSubtitle>
    </CardBody>
    {props.event.owner ? (
     <ListGroup flush>
      <ListGroupItem>Owner: {props.event.owner.name}</ListGroupItem>
      <ListGroupItem>Role: {capitalize(props.event.owner.meta.type)}</ListGroupItem>
     </ListGroup>
    ) : (
      <React.Fragment>
      <ListGroup flush>
      <ListGroupItem>Teacher: {props.event.teacher ? props.event.teacher.name : "Unknown"}</ListGroupItem>
      <ListGroupItem>Group: {props.event.group ? props.event.group.name : "Unknown"}</ListGroupItem>
      <ListGroupItem>Room: {props.event.room ? props.event.room.name : "unknown"}</ListGroupItem>
      </ListGroup>
      <CardFooter>
      <button className="btn btn-secondary" onClick={handleOnDelete}>Delete</button>
    </CardFooter>
    </React.Fragment>
    )}
  </Card>
  );
}

