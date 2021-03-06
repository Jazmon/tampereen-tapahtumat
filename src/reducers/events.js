import * as ActionTypes from '../ActionTypes';

const initialState = {
  events: [],
  isFetching: false,
  error: null,
};

export default function events(state = initialState, action) {
  switch (action.type) {
  case ActionTypes.REQUEST_EVENTS:
    return {
      ...state,
      isFetching: true,
    };

  case ActionTypes.RECEIVE_EVENTS:
    return {
      ...state,
      events: [...state.events, action.payload.events],
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
