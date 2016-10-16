// @flow
import * as ActionTypes from '../ActionTypes';
import type { ActionType } from '../actions';

type EventsState = {
  items: Array<Event>; // TODO improve by removing Object
  isFetching: boolean;
  didInvalidate: boolean;
  error: ?Object;
};

const initialState: EventsState = {
  items: [],
  isFetching: false,
  didInvalidate: false,
  error: null,
};

export const events = (state: EventsState = initialState, action: ActionType) => {
  switch (action.type) {
  case ActionTypes.REQUEST_EVENTS:
    return {
      ...state,
      isFetching: true,
    };

  case ActionTypes.RECEIVE_EVENTS:
    return {
      ...state,
      items: action.payload,
      isFetching: false,
    };

  case ActionTypes.RECEIVE_EVENTS_ERROR:
    return {
      ...state,
      isFetching: false,
      error: action.payload,
    };
  default:
    return state;
  }
};

export const eventsByDate = (state: Object = {}, action: ActionType) => {
  switch (action.type) {
  case ActionTypes.RECEIVE_EVENTS:
  case ActionTypes.REQUEST_EVENTS:
    return {
      ...state,
      [action.payload]: events(state[action.payload], action),
    };
  default:
    return state;
  }
};

export default events;
