import React from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'reactstrap';

import { Schema } from '@app/store';
import { entities, ui } from '@app/actions';

import {capitalize, values} from 'lodash/fp';

const mapDispatchToProps = (dispatch: any, props: any) => {
  return {
    onCreateCalendar: (name: string, type: Schema.CalendarType, size?: number) => {
      dispatch(entities.createCalendar(props.history, name, type, size));
    },
    onCreateCalendarFromResource: (calendar: Schema.CalendarResource, type: Schema.CalendarType, size?: number) => {
      dispatch(entities.createCalendarFromResource(props.history, calendar, type, size));
    },
    error: (message: string) => {
      dispatch(ui.error(message));
    }
  };
}

const mapStateToProps = (state: Schema.Store) => {
  return {
    calendarResources: state.resources.calendars
  }
}

interface CalendarFormState {
  useExisting: boolean;
  resource: Schema.EntityId;
  name: string;
  type: Schema.CalendarType;
  size: number;
  [name: string]: any;
}

interface CalendarFormProps {
  onCreateCalendar: (name: string, type: Schema.CalendarType, size?: number) => void;
  onCreateCalendarFromResource: (calendar: Schema.CalendarResource, type: Schema.CalendarType, size?: number) => void;
  calendarResources: Schema.CalendarResources;
  match: any;
  history: any;
  error:(message: string) => void;
}

class CalendarFormView extends React.Component<CalendarFormProps, CalendarFormState> {

  constructor(props: CalendarFormProps) {
    super(props);

    let type: Schema.CalendarType = "TEACHER";
    switch(this.props.match.params.type) {
      case "teacher":
        type = "TEACHER";
        break;
      case "room":
        type = "ROOM";
        break;
      case "group":
        type = "GROUP";
        break;
      default:
        this.props.history.push("/");
        break;
    }

    this.state = {
      useExisting: true,
      resource: "null",
      name: "",
      type,
      size: 0,
    }

  this.handleInputChange = this.handleInputChange.bind(this);
  this.handleSubmit = this.handleSubmit.bind(this);

  }

  handleInputChange(e: any) {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name: any = target.name;

    this.setState({[name]: value});
  }

  handleSubmit(e: any) {
    e.preventDefault();
    if(this.state.useExisting) {
      if(this.state.resource === "null") {
        this.props.error("No valid calendar is selected");
        return;
      }
      this.props.onCreateCalendarFromResource(this.props.calendarResources[this.state.resource], this.state.type, this.state.type !== "TEACHER" ? this.state.size : undefined);
    }
    else {
      if(this.state.name.length === 0) {
        this.props.error("Name must be defined");
        return;
      }
      if(this.state.type !== "TEACHER" && this.state.size <= 0) {
        this.props.error("Size must be positive");
        return;
      }
      this.props.onCreateCalendar(this.state.name, this.state.type, this.state.type !== "TEACHER" ? this.state.size : undefined);
    }
  }

  render() {

    const nameInp = (
      <div className="form-group">
        <label> Name of {capitalize(this.state.type)} </label>
        <input value={this.state.name} onChange={this.handleInputChange} type="text" className="form-control" name="name"/>
      </div>
    );

    const sizeInp = (
      <div className="form-group">
        <label> Size of {capitalize(this.state.type)}</label>
        <input value={this.state.size} onChange={this.handleInputChange} type="number" className="form-control" name="size"/>
      </div>
    );

    const existingInp = (
      <div className="form-group">
        <label> Select existing calendar: </label>
        <select value={this.state.resource} onChange={this.handleInputChange} className="form-control" name="resource">
          <option value="null">-- Not selected --</option>
          {
            values(this.props.calendarResources).map((c: Schema.CalendarResource) => {
              return(
                 <option key={c.id} value={c.id}>{c.name}</option>
               );
            })
          }
        </select>
      </div>
    );

    return (
      <Row>
        <Col>
          <form onSubmit={this.handleSubmit}>
            <div className="form-group form-check">
              <input type="checkbox" className="form-check-input" checked={this.state.useExisting} onChange={this.handleInputChange} name="useExisting"/>
              <label> Use existing calendar:</label>
            </div>
            {this.state.useExisting ? existingInp : nameInp}
            {this.state.type !== "TEACHER" ? sizeInp : (<div />)}
            <button type="submit" className="btn btn-primary">Create {capitalize(this.state.type)}</button>
          </form>
        </Col>
      </Row>
    );
  }
}

const CalendarForm = connect(
                      mapStateToProps,
                      mapDispatchToProps
                    )(CalendarFormView);

export { CalendarForm };
