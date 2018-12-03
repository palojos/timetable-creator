import React from 'react';
import { connect } from 'react-redux';

import { Schema } from '@app/store';
import { entities } from '@app/actions';

const mapDispatchToProps = (dispatch: any) => {
  return {
    onCreateCalendar: (name: string, type: Schema.CalendarType, size?: number) => {
      dispatch(entities.createCalendar(name, type, size))
    }

  }
}

const mapStateToProps = (state: Schema.Store) => {
  return {
    calendarResources: state.resources.calendars
  }
}

interface CreateCalendarFormState {
  name: string;
  type: Schema.CalendarType;
  size?: number;
}

interface CreateCalendarFormProps {
  onCreateCalendar: (name: string, type: Schema.CalendarType, size?: number) => void;
  calendarResources: Schema.CalendarResource[];
  match: any;
  history: any;
}

class CreateCalendarForm extends React.Component <CreateCalendarFormProps, CreateCalendarFormState> {

  constructor(props: CreateCalendarFormProps) {
    super(props);

    let type = Schema.CalendarType.TEACHER;
    let size
    switch (this.props.match.params.type) {
      case "teacher":
        type = Schema.CalendarType.TEACHER;
        break;
      case "room":
        type = Schema.CalendarType.ROOM;
        size = 0;
        break;
      case "group":
        type = Schema.CalendarType.GROUP;
        size = 0;
        break;
      default:
        this.props.history.push('/');
        break;
    }

    this.state = {
      name: "",
      type,
      size
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleSizeChange = this.handleSizeChange.bind(this);
  }

  handleSubmit(event: any) {
    event.preventDefault();
    this.props.onCreateCalendar(this.state.name, this.state.type, this.state.size);
    this.props.history.push('/');
  }

  handleNameChange(event: any) {
    this.setState({name: event.target.value});
  }

  handleSizeChange(event: any) {
    this.setState({size: event.target.value});
  }

  render() {

    const SizeInput = (
      <label>
        Size:
        <input type="number" value={this.state.size} onChange={this.handleSizeChange} />
      </label>
    );
    return(
      <form onSubmit={this.handleSubmit}>
        <label>
          Calendar name:
          <input type="text" value={this.state.name} onChange={this.handleNameChange} />
        </label>
        {this.state.size != undefined ? SizeInput : null}
        <input type="submit" value="Create Calendar" />
      </form>
    );
  }
}

const CalendarForm = connect(
                      mapStateToProps,
                      mapDispatchToProps
                    )(CreateCalendarForm);

export { CalendarForm };
