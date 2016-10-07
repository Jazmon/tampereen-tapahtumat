// @flow
import { Observable } from 'rxjs/Observable';
import Geocoder from 'react-native-geocoder';
import locale from 'react-native-locale-detector';
import moment from 'moment';

import * as ActionTypes from '../ActionTypes';
import { receiveEvents } from '../actions';

import config from '../../config.json';

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
  if (!locale_) return null;
  return locale_.split('-')[0];
};

const apiLocale = getApiLocale(locale) || config.defaultApiLocale;

const apiUrl = config.baseApiUrl;
const start = moment().startOf('day').valueOf();
const end = moment().add(6, 'days').endOf('day').valueOf();
const lang = locale ? apiLocale : config.defaultApiLocale;
const eventLimit = 20;

const url = `${apiUrl}&limit=${eventLimit}&start_datetime=${start}&end_datetime=${end}&lang=${lang}`;


// This is where the magic happens :)
export default (action$: Object) =>
  action$.ofType(ActionTypes.REQUEST_EVENTS)
    .switchMap(() =>
      Observable.fromPromise(fetch(url)))
      .switchMap((res) =>
        Observable.fromPromise(res.json()))
        .mergeMap(events => events)
        .map(getLocationlessMarker)
        .map(applyAddressToEvent)
        .flatMap(event =>
          Observable.fromPromise(getLocation(event))
          .delay(400)
          .map(receiveEvents));
