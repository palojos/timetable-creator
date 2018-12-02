import React from 'react';

import { connect } from 'react-redux';
import { entities } from '@app/actions';

type Dispatcher = (action: any) => any

let AppRenderer = ({dispatch}:{dispatch:Dispatcher}) => {

  const roomClick = () => dispatch(entities.createRoom("Room1", 10))
  const clearClick = () => dispatch(entities.clearEntities());
  return (
    <div>
      <h1>
        App
      </h1>

      <button
        onClick={roomClick}
      >
      Room
      </button>
      <button
        onClick={dispatch(entities.createGroup("Group1", 10))}
      >
      Group
      </button>
      <button
        onClick={dispatch(entities.createTeacher("Teacher1"))}
      >
      Teacher
      </button>
      <button onClick={clearClick}>
        Clear
      </button>
    </div>

  );
}

let App = connect()(AppRenderer);

export default App;
