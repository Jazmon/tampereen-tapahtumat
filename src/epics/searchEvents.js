import { Observable } from 'rxjs/Observable';
import * as ActionTypes from '../ActionTypes';
import { receiveEvents } from '../actions';

export default (action$) =>
  action$.ofType(ActionTypes.REQUEST_EVENTS)
    .switchMap(() =>
      Observable.fromPromise(fetch('http://visittampere.fi/api/search?type=event'))
      .switchMap((res) =>
        Observable.fromPromise(res.json()))
        .map(events => receiveEvents(events))
    );
