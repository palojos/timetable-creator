
//Exporting store schema under Schema namespace
import * as Schema from './schema'; export { Schema };

import { createStore } from 'redux';
import { rootReducer } from '@app/reducers';

// Exporting store configuration function
export function configureStore() {
  const store = createStore(rootReducer);

  return store;
}
