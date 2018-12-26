import React from 'react';
import { render } from 'react-dom';

import { BrowserRouter as Router} from 'react-router-dom';
import { Provider } from 'react-redux';

import { configureStore } from '@app/store';
import { App } from '@app/components';

import '@app/iconlib';

// Create redux store
const store = configureStore();

render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>,
  document.getElementById('react-root')
);

export { store };
