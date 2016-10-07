import * as ActionTypes from '../ActionTypes';

export function requestEvents() {
  console.log('request events');
  return {
    type: ActionTypes.REQUEST_EVENTS,
  };
}

export function receiveEvents(events) {
  console.log('receive events', events);
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
