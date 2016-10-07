// @flow
import { Observable } from 'rxjs/Observable';
import Geocoder from 'react-native-geocoder';
import locale from 'react-native-locale-detector';
import moment from 'moment';
// import { Dimensions } from 'react-native';

import * as ActionTypes from '../ActionTypes';
import { receiveEvents } from '../actions';

/* eslint-disable global-require */
if (locale.startsWith('fi')) {
  require('moment/locale/fi');
} else if (locale.startsWith('se')) {
  require('moment/locale/se');
}
/* eslint-enable global-require */

// const { width, height } = Dimensions.get('window');
// const ASPECT_RATIO = width / height;
// const LATITUDE = 61.497421;
// const LONGITUDE = 23.757292;
// const LATITUDE_DELTA = 0.0322;
// const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
// const SPACE = 0.01;

Geocoder.fallbackToGoogle('AIzaSyDtMhGRmlbnuDXisY0Zg7pFkv-4Ot0mSqI');
// const promises = [];
// const markers = events.map((event, i) => {
//   const marker: Object = {
//     id: event.item_id,
//     title: event.title,
//     description: event.description,
//     event,
//   };
//   const address = getAddressFromEvent(event);
//   const promise = getLocation(address);
//   promises.push(promise);
//   return marker;
// });
// Promise.all(promises).then(locations => {
//   markers.forEach((marker, i) => {
//     if (locations[i]) {
//       marker.latlng = locations[i];
//     } else {
//       marker.latlng = {
//         latitude: 61.497421,
//         longitude: 23.757292,
//       };
//     }
//   });
//   const nonNullMarkers = markers.filter((m) => m !== null);
//   this.setMarkers(nonNullMarkers);
//   this.setState({ loading: false });
// })

export const getLocation = async(event: Object) => {
  try {
    console.log('getlocation', 'event', event);
    const addresses: Array<GeoCode> = await Geocoder.geocodeAddress(event.address);
    const geoCode: GeoCode = addresses[addresses.length - 1];
    if (!geoCode) {
      return null;
    }

    const latlng: LatLng = {
      latitude: geoCode.position.lat,
      longitude: geoCode.position.lng,
    };
    console.log('latlng', latlng);
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
  if (obj && obj.hasOwnProperty(prop) && !!obj[prop]) {
    return `${str}${spacer}${obj[prop]}`;
  }
  return str;
};

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

const parseEvents = (events) =>
  events
    .map(getLocationlessMarker)
    .map(applyAddressToEvent);


const getApiLocale = (locale_: ?string): ?string => {
  if (!locale_) return null;
  return locale_.split('-')[0];
};

const apiLocale = getApiLocale(locale) || 'en';

const apiUrl = 'http://visittampere.fi/api/search?type=event';
const start = moment().startOf('day').valueOf();
const end = moment().add(6, 'days').endOf('day').valueOf();
const lang = locale ? apiLocale : 'en';
const url = `${apiUrl}&limit=20&start_datetime=${start}&end_datetime=${end}&lang=${lang}`;

export default (action$: Object) =>
  action$.ofType(ActionTypes.REQUEST_EVENTS)
    .switchMap(() =>
      Observable.fromPromise(fetch(url)))
      .switchMap((res) =>
        Observable.fromPromise(res.json()))
        .flatMap(events => events)
        .map(getLocationlessMarker)
        .map(applyAddressToEvent)
        .flatMap(event =>
          Observable.fromPromise(getLocation(event))
          .map(receiveEvents))

        // .map(parseEvents)
        // .flatMap(e => e)
        // .flatMap(event => console.log('event', event) || Observable.fromPromise(getLocation(event.address)))
        // .map(events => receiveEvents(events))
    ;
