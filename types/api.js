/* eslint-disable no-undef */
declare type LatLng = {
  latitude: number;
  longitude: number;
};

declare type Marker = {
  latlng: LatLng;
  id: number;
  title: string;
  description: string;
  event: Event;
};

declare type GeoCode = {
  position: {lat: number; lng: number};
  formattedAddress: string; // the full address
  feature: ?string; // ex Yosemite Park, Eiffel Tower
  streetNumber: ?string;
  streetName: ?string;
  postalCode: ?string;
  locality: ?string; // city name
  country: string;
  countryCode: string;
  adminArea: ?string;
  subAdminArea: ?string;
  subLocality: ?string;
};

declare type Event = {
  item_id: number;
  lang: string;
  title: string;
  description: string;
  contact_info: {
    id: number;
    address: ?string;
    postcode: ?string;
    city: ?string;
    country: ?string;
    phone: ?string;
    email: ?string;
    link: ?string;
    company_name: ?string;
    company_id: ?string | ?number;
    place_of_business: ?any;
  };
  created_at: number;
  updated_at: number;
  image?: {
    item_id: number;
    src: string;
    title: string;
  };
  start_datetime: ?number;
  end_datetime: ?number;
  type: 'event' | 'article' | 'location';
  tags: Array<string>;
  is_free: boolean;
  ticket_link: ?string;
  is_public: boolean;
  has_articles: boolean;
  single_datetime: boolean;
  times: Array<{
    id: number;
    start_datetime: number;
    end_datetime: number;
  }>;
  form_contact_info: ?{
    name: string;
    email: ?string;
    phone: ?string;
    job_title: ?string;
  };
  is_in_moderation: boolean;
};
