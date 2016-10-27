// @flow
import { combineReducers } from 'redux';
import { eventsByDate } from './events';
import selectedDate from './selectedDate';

export default combineReducers({
  // events,
  date: selectedDate,
  eventsByDate,
});
