import * as ActionTypes from '../ActionTypes';

export default function events(state = {}, action) {
  switch (action.type) {
  case ActionTypes.REQUEST_EVENTS:
    return {
      ...state,
      isFetching: true,
    };

  case ActionTypes.RECEIVE_EVENTS:
    return {
      ...state,
      events: action.payload.events,
      isFetching: false,
    };

  case ActionTypes.RECEIVE_EVENTS_ERROR:
    return {
      ...state,
      isFetching: false,
      error: action.payload.error,
    };
  default:
    return state;
  }
}
