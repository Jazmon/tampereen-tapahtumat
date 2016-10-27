// @flow
import { Observable } from 'rxjs/Observable';
import Geocoder from 'react-native-geocoder';
import locale from 'react-native-locale-detector';
import moment from 'moment';

import * as ActionTypes from '../ActionTypes';
import { receiveEvents } from '../actions';

import config from '../../config.json';

// This loads moment locales for the language based on the locale.
// Yes, it's ugly but it's the only way :(
/* eslint-disable global-require */
if (locale.startsWith('fi')) {
  require('moment/locale/fi');
} else if (locale.startsWith('se')) {
  require('moment/locale/se');
}
/* eslint-enable global-require */

Geocoder.fallbackToGoogle(config.googleApiKey);

export const getLocation = async(event: Object) => {
  try {
    const addresses: Array<GeoCode> = await Geocoder.geocodeAddress(event.address);
    const geoCode: GeoCode = addresses[addresses.length - 1];
    if (!geoCode) {
      return null;
    }

    const latlng: LatLng = {
      latitude: geoCode.position.lat,
      longitude: geoCode.position.lng,
    };
    return {
      ...event,
      latlng,
    };
  } catch (err) {
    console.warn(err);
    return null;
  }
};


const getLocationlessMarker = (event) => ({
  id: event.item_id,
  title: event.title,
  description: event.description,
  event,
});

const applyIfExist = ({ obj, prop, str = '', spacer = '' }) => {
  if (obj && {}.hasOwnProperty.call(obj, prop) && !!obj[prop]) {
    return `${str}${spacer}${obj[prop]}`;
  }
  return str;
};

// Parses the address from the contact info.
export const getAddressFromEvent = (event: Event): string => {
  let address = '';
  const obj = event.contact_info;

  address = applyIfExist({ obj, prop: 'address', str: address, spacer: '' });
  address = applyIfExist({ obj, prop: 'postcode', str: address, spacer: ' ' });
  // address = applyIfExist({ obj, prop: 'city', str: address, spacer: ' ' });
  address += ', Tampere';
  // address = applyIfExist({ obj, prop: 'country', str: address, spacer: ' ' });
  return address;
};


const applyAddressToEvent = (event) => ({
  ...event,
  address: getAddressFromEvent(event.event),
});

const getApiLocale = (locale_: ?string): ?string => {
  if (!locale_ || locale_ === 'und') return null;
  return locale_.split('-')[0];
};

const apiLocale = getApiLocale(locale) || config.defaultApiLocale;
const eventLimit = 20;
const dayLimit = 6;
const apiUrl = config.baseApiUrl;
const start = moment().startOf('day').valueOf();
const end = moment().add(dayLimit, 'days').endOf('day').valueOf();
const lang = locale ? apiLocale : config.defaultApiLocale;
const url = `${apiUrl}&limit=${eventLimit}&start_datetime=${start}&end_datetime=${end}&lang=${lang}`;

const onlyDefined = (obj: ?any) => !!obj;

const getEvents = async({ date }: { date: number }) => {
  const dayStart = moment().add(date, 'days').startOf('day').valueOf();
  const dayEnd = moment().add(date, 'days').endOf('day').valueOf();
  const dayUrl = `${apiUrl}&limit=${eventLimit}&start_datetime=${dayStart}&end_datetime=${dayEnd}&lang=${lang}`;
  console.log('dayUrl', dayUrl);
  const response = await fetch(dayUrl);
  const json = await response.json();
  console.log('json', json);
  return json;
};

const flattenMultipleDateEvents = async(events: Array<Event>) => {
  let newEvents = [...events];
  events
    .filter(event => !event.single_datetime)
    .forEach(event => {
      const duplicatedEvents = event.times.map(time => {
        const newEvent: Event = {
          ...event,
          single_datetime: true,
          times: [],
          start_datetime: time.start_datetime,
          end_datetime: time.end_datetime,
        };
        return newEvent;
      });
      newEvents = [...newEvents, ...duplicatedEvents];
    });
  return newEvents;
};

// console.log('locale', locale);
// console.log('apiLocale', apiLocale);
// console.log('lang', lang);
// console.log('url', url);

// This is where the magic happens :)
// TODO: res error handling
// TODO: caching and taking events from cache
// TODO: setting events by date
// TODO: multiply events when multiple dates
export default (action$: Object) =>
  action$.ofType(ActionTypes.REQUEST_EVENTS)
    .flatMap(action =>
      Observable.fromPromise(getEvents(action.payload))
        .mergeMap(flattenMultipleDateEvents)
        .mergeMap(events => events) // Splits stream into individual event objects
        .map(getLocationlessMarker)
        .map(applyAddressToEvent)
        .flatMap(event =>
          Observable.fromPromise(getLocation(event))
          .filter(onlyDefined)
          // .delay(400)
          .map(e => receiveEvents(e instanceof Array ? e : [e], action.payload))));

// export default (action$: Object) =>
//   action$.ofType(ActionTypes.REQUEST_EVENTS)
//     .switchMap(action =>
//       Observable.fromPromise(fetch(url))
//       .switchMap((res) =>
//         Observable.fromPromise(res.json()))
//         .mergeMap(events => events) // Splits stream into individual event objects
//         .map(getLocationlessMarker)
//         .map(applyAddressToEvent)
//         .flatMap(event =>
//           Observable.fromPromise(getLocation(event))
//           .filter(onlyDefined)
//           .delay(400)
//           .map(e => receiveEvents(e, action.payload))));
