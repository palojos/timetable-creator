
//Exporting store schema under Schema namespace
import * as Schema from './schema'; export { Schema };

import { createStore, combineReducers, applyMiddleware } from 'redux';
import * as reducers from '@app/reducers';

import thunk from 'redux-thunk';
//import logger from 'redux-logger';

// Exporting store configuration function
export function configureStore() {
  const middleware = applyMiddleware(thunk);
  const rootReducer = combineReducers(reducers);
  const store = createStore(rootReducer, middleware);

  return store;
}
