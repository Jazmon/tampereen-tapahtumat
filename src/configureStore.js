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
  ];

  const devMiddlewares = [
    ...middlewares,
    createLogger(),
  ];

  const enhancers = [
    applyMiddleware(...middlewares),
  ];

  const devEnhancers = [
    applyMiddleware(...devMiddlewares),
    devTools(),
  ];

  const store = createStore(
    rootReducer,
    initialState,
    compose(...__DEV__ ? devEnhancers : enhancers),
  );

  return store;
};

export default configureStore;
