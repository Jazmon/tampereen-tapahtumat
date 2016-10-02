import { combineEpics } from 'redux-observable';
import searchEvents from './searchEvents';

export default combineEpics({
  searchEvents,
});
