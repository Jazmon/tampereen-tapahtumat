// @flow
import * as ActionTypes from '../ActionTypes';

export const requestEvents = (date: number) => ({
  type: ActionTypes.REQUEST_EVENTS,
  payload: date,
});

export const receiveEvents = (events: Array<Event>, date: number) => ({
  type: ActionTypes.RECEIVE_EVENTS,
  payload: events,
  meta: date,
});

export const receiveEventsError = (error: Object, date: number) => ({
  type: ActionTypes.RECEIVE_EVENTS_ERROR,
  error: true,
  payload: error,
  meta: date,
});

export const shouldFetchEvents = (state: Object, date: number) => {
  const events = state.postsByDate(date);
  if (!events) {
    return true;
  } else if (events.isFetching) {
    return false;
  }
  return events.didInvalidate;
};

// export const fetchPostsIfNeeded()

export const invalidateEvents = (date: number) => ({
  type: ActionTypes.INVALIDATE_EVENTS,
  payload: date,
});

export const selectDate = (date: number) => ({
  type: ActionTypes.SELECT_DATE,
  payload: date,
});

export type ActionType = {
  type: string;
  error?: boolean;
  payload: any;
  meta?: any;
};
