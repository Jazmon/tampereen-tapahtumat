// @flow
import { combineEpics } from 'redux-observable';
import searchEvents from './searchEvents';
import dateChanged from './dateChanged';

export default combineEpics(
  searchEvents,
  dateChanged,
);

// export default searchEvents;
