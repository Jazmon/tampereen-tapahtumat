import { Observable } from 'rxjs/Observable';
import * as ActionTypes from '../ActionTypes';
import { receiveEvents } from '../actions';

export default function searchEvents(action$) {
  return action$.oftype(ActionTypes.REQUEST_EVENTS)
    .map(action => action.payload.query)
    // .filter(q => !!q)
    .switchMap(() =>
      Observable.timer(800)
        .map(() => fetch('https://foo.bar/api/'))
        .map(res => res.json)
        .map(receiveEvents)
        // .takeUntil(action$.ofType(ActionTypes.))
        // .mergeMap(() => Observable.merge(
        //   Observable.of(replace)
        // ))
    );
}
