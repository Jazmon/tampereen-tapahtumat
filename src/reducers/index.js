// @flow
import { combineReducers } from 'redux';
import { events, eventsByDate } from './events';
import selectedDate from './selectedDate';

export default combineReducers({
  events,
  date: selectedDate,
  eventsByDate,
});
