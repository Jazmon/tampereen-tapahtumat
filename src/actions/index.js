import * as ActionTypes from '../ActionTypes';

export const selectDay = (day) => ({
  type: ActionTypes.SELECT_DAY,
  payload: {
    day,
  },
});

export const invalidateDay = (day) => ({
  type: ActionTypes.INVALIDATE_DAY,
  payload: {
    day,
  },
});

export const requestEvents = () => ({
  type: ActionTypes.REQUEST_EVENTS,
});

export const receiveEvents = (events) => ({
  type: ActionTypes.RECEIVE_EVENTS,
  payload: {
    events,
  },
});

export const receiveEventsError = (error) => ({
  type: ActionTypes.RECEIVE_EVENTS_ERROR,
  payload: {
    error,
  },
});
