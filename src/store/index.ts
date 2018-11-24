
//Exporting store schema under Schema namespace
import * as Schema from './schema'; export { Schema };

// Create and export store

import { createStore } from 'redux';

import { rootReducer } from '@app/reducers';

export function configureStore() {
  const store = createStore(rootReducer);

  return store;
}
