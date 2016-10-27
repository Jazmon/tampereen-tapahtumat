import 'rxjs';
import * as ActionTypes from '../ActionTypes';
import { requestEvents } from '../actions';

export default (action$: Object, store) =>
  action$.ofType(ActionTypes.SELECT_DATE)
    // .filter(action => !!store.getState().eventsByDate[store.getState().date] && !store.getState().eventsByDate[store.getState().date].isFetching)
    .map(action => requestEvents(action.payload));
