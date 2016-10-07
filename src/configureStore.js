import { createStore, applyMiddleware, compose } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import devTools from 'remote-redux-devtools';
import createLogger from 'redux-logger';

import rootReducer from './reducers';
import rootEpic from './epics';

const epicMiddleware = createEpicMiddleware(rootEpic);
const configureStore = (initialState) => {
  const middlewares = [
    epicMiddleware,
    createLogger(),
  ];

  const enhancers = [
    applyMiddleware(...middlewares),
    devTools(),
  ];

  const store = createStore(
    rootReducer,
    initialState,
    compose(...enhancers),
  );

  return store;
};

export default configureStore;
