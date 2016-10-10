import * as ActionTypes from '../ActionTypes';

export function requestEvents() {
  return {
    type: ActionTypes.REQUEST_EVENTS,
  };
}

export function receiveEvents(events) {
  return {
    type: ActionTypes.RECEIVE_EVENTS,
    payload: {
      events,
    },
  };
}

export function receiveEventsError(error) {
  return {
    type: ActionTypes.RECEIVE_EVENTS_ERROR,
    payload: {
      error,
    },
  };
}
