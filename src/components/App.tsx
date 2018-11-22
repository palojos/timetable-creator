import React from 'react';

interface IAppProps {}

export class App extends React.Component {

  constructor(props: IAppProps) {
    super(props);
  }

  render() {
    return(
      <h1>
        Hello React!
      </h1>
    );
  }
}