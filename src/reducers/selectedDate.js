// @flow
import * as ActionTypes from '../ActionTypes';
import type { ActionType } from '../actions';

const initialState: number = 0;

const selectedDate = (state: number = initialState, action: ActionType) => {
  switch (action.type) {
  case ActionTypes.SELECT_DATE:
    return action.payload;
  default:
    return state;
  }
};

export default selectedDate;
