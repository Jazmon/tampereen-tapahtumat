// @flow
import Geocoder from 'react-native-geocoder';
import moment from 'moment';

import { getAddressFromEvent } from './utils';

const API_URL_BASE = 'http://visittampere.fi/api/search?type=event';

Geocoder.fallbackToGoogle('AIzaSyDtMhGRmlbnuDXisY0Zg7pFkv-4Ot0mSqI');
export const fetchEvents = async({ url }: { url: string }) => {
  try {
    const response = await fetch(url);
    const events = await response.json();
    return events;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const getLocation = async(address: string) => {
  try {
    const addresses: Array<GeoCode> = await Geocoder.geocodeAddress(address);
    const geoCode: GeoCode = addresses[addresses.length - 1];
    if (!geoCode) {
      return null;
    }
    const latlng: LatLng = {
      latitude: geoCode.position.lat,
      longitude: geoCode.position.lng,
    };
    return latlng;
  } catch (err) {
    console.warn(err);
    return null;
  }
};

// returns all events from this day up to a week
export const getEvents = async() => {
  const start: number = moment().startOf('day').valueOf();
  const end: number = moment().add(6, 'days').endOf('day').valueOf();
  const url: string = `${API_URL_BASE}&limit=20&start_datetime=${start}&end_datetime=${end}&lang=fi`;
  // eslint-disable-next-line consistent-return
  fetchEvents({ url }).then(events => {
    if (events === null) { return null; }
    const promises: Array<Object> = [];
    const markers = events.map((event) => {
      const marker: Object = {
        id: event.item_id,
        title: event.title,
        description: event.description,
        event,
      };
      const address = getAddressFromEvent(event);
      const promise = getLocation(address);
      promises.push(promise);
      return marker;
    });
    Promise.all(promises).then(locations => {
      markers.forEach((marker, i) => {
        if (locations[i]) {
          marker.latlng = locations[i]; // eslint-disable-line no-param-reassign
        } else {
          // else set default location
          marker.latlng = { // eslint-disable-line no-param-reassign
            latitude: 61.497421,
            longitude: 23.757292,
          };
        }
      });
      const nonNullMarkers = markers.filter((m) => m !== null);
      return nonNullMarkers;
    });
  }).catch(err => console.error(err));
};
