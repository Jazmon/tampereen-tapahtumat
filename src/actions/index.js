// @flow
import * as ActionTypes from '../ActionTypes';

export const requestEvents = () => ({
  type: ActionTypes.REQUEST_EVENTS,
});

export const receiveEvents = (events: Array<Event>) => ({
  type: ActionTypes.RECEIVE_EVENTS,
  payload: events,
});

export const receiveEventsError = (error: Object) => ({
  type: ActionTypes.RECEIVE_EVENTS_ERROR,
  error: true,
  payload: error,
});

export const shouldFetchEvents = () => {

};

export type ActionType = {
  type: string;
  error?: boolean;
  payload: any;
};
