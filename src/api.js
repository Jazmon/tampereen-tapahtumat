// @flow
import Geocoder from 'react-native-geocoder';
import moment from 'moment';
import locale from 'react-native-locale-detector';
import _ from 'lodash';

import config from '../config.json';
import { getAddressFromEvent } from './utils';

function getApiLocale(locale_: ?string): ?string {
  if (!locale_) return null;
  return locale_.split('-')[0];
}

const apiLocale: string = getApiLocale(locale) || 'en';

const API_URL_BASE: string = 'http://visittampere.fi/api/search?type=event';

Geocoder.fallbackToGoogle(config.googleApiKey);

// returns json from url
export const fetchJson = async({ url }: { url: string }) => {
  try {
    const response: Response = await fetch(url);
    const resJson: any = await response.json();
    return resJson;
  } catch (e) {
    console.error(e);
    return null;
  }
};

// Geocodes the address, returning a latlng
export const geocodeAddress = async(address: string) => {
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

const start = (num = 0): number => moment().add(num, 'days').startOf('day').valueOf();
const end = (num = 6): number => moment().add(num, 'days').endOf('day').valueOf();
const getUrl = ({ startDate, endDate }: { startDate: Function; endDate: Function }
   = { startDate: start, endDate: end }) =>
    `${API_URL_BASE}&limit=20&start_datetime=${startDate()}&end_datetime=${endDate()}&lang=${apiLocale}`;


type SingleTimeVTEvent = {
  item_id: number;
  lang: string;
  title: string;
  description: string;
  contact_info: VTContactInfo;
  created_at: number;
  updated_at: number;
  image?: VTImage;
  start_datetime: ?number;
  end_datetime: ?number;
  type: VTApiType;
  tags: Array<string>; // TODO figure out all of these
  is_free: boolean;
  ticket_link: ?string;
  is_public: boolean;
  has_articles: boolean;
  form_contact_info: ?VTFormContactInfo;
  is_in_moderation: boolean;
};

const getSingleDateEvents = (events: Array<VTEvent>): Array<SingleTimeVTEvent> => {
  const singleDateEvents: Array<SingleTimeVTEvent> = [];
  events.forEach(event => {
    if (event.single_datetime) {
      singleDateEvents.push(event);
    } else {
      event.times.forEach((time, index) => {
        singleDateEvents.push({
          ...event,
          item_id: event.item_id + index * 100000,
          start_datetime: time.start_datetime,
          end_datetime: time.end_datetime,
        });
      });
    }
  });
  return singleDateEvents;
};

// returns all events from this day up to a week
export const getEvents = async() => {
  const url: string = getUrl();
  const rawEvents: ?Array<VTEvent> = await fetchJson({ url });
  if (!rawEvents) { return []; }

  const singleDateEvents: Array<SingleTimeVTEvent> = getSingleDateEvents(rawEvents);

  const geocodedEventPromises: Array<Promise<Event>> = singleDateEvents.map(async (rawEvent, i) => {
    const address: string = getAddressFromEvent(rawEvent);
    // console.log('address', address);
    const DELTA = 100000;
    const latlng: LatLng = await geocodeAddress(address) || {
      latitude: 61.497421 + (i % 2 === 0 ? i / DELTA : -i / DELTA),
      longitude: 23.757292 + (i % 3 === 0 ? i / DELTA : -i / DELTA),
    };
    // console.log('latlng', latlng);

    // if (!latlng) { return null; }
    const event: Event = {
      id: `event-${rawEvent.item_id}`,
      title: rawEvent.title,
      description: rawEvent.description,
      start: rawEvent.start_datetime || 0,
      end: rawEvent.end_datetime || 0,
      free: rawEvent.is_free,
      contactInfo: {
        address: rawEvent.contact_info.address,
        email: rawEvent.contact_info.email,
        phone: rawEvent.contact_info.phone,
        link: rawEvent.contact_info.link,
      },
      formContactInfo: {
        email: _.get(rawEvent, 'form_contact_info.email', null),
        phone: _.get(rawEvent, 'form_contact_info.phone', null),
        name: _.get(rawEvent, 'form_contact_info.name', null),
        jobTitle: _.get(rawEvent, 'form_contact_info.jobTitle', null),
      },
      tags: rawEvent.tags,
      image: {
        title: _.get(rawEvent, 'image.title', null),
        uri: _.get(rawEvent, 'image.src', null),
      },
      // vtEvent: rawEvent,
      latlng,
    };
    return event;
  });

  const events: Array<Event> = await Promise.all(geocodedEventPromises);
  return events;

  // fetchJson({ url }).then(events => {
  //   if (events === null) { return null; }
  //   const promises: Array<Object> = [];
  //   const markers = events.map((event) => {
  //     const marker: Object = {
  //       id: event.item_id,
  //       title: event.title,
  //       description: event.description,
  //       event,
  //     };
  //     const address = getAddressFromEvent(event);
  //     const promise = getLocation(address);
  //     promises.push(promise);
  //     return marker;
  //   });
  //   Promise.all(promises).then(locations => {
  //     markers.forEach((marker, i) => {
  //       if (locations[i]) {
  //         marker.latlng = locations[i]; // eslint-disable-line no-param-reassign
  //       } else {
  //         // else set default location
  //         marker.latlng = { // eslint-disable-line no-param-reassign
  //           latitude: 61.497421,
  //           longitude: 23.757292,
  //         };
  //       }
  //     });
  //     const nonNullMarkers = markers.filter((m) => m !== null);
  //     return nonNullMarkers;
  //   });
  // }).catch(err => console.error(err));
};
