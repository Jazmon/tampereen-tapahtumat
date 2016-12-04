/* eslint-disable no-undef */

//
// Geocode service
// _____________________

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

//
// visittampere.fi API
// ____________________

declare type VTImage = {
  item_id: number;
  src: string;
  title: string;
}

declare type VTContactInfo = {
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

declare type VTApiType = 'event' | 'article' | 'location';

declare type VTTime = {
  id: number;
  start_datetime: number;
  end_datetime: number;
};

declare type VTFormContactInfo = {
  name: string;
  email: ?string;
  phone: ?string;
  job_title: ?string;
};

declare type VTEvent = {
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
  single_datetime: boolean;
  times: Array<VTTime>;
  form_contact_info: ?VTFormContactInfo;
  is_in_moderation: boolean;
};

declare type ApiTime = {
  id: number;
  start: number;
  end: number;
  // createdAt: string;
  // updatedAt: string;
  EventId: number;
}

declare type ApiImage = {
  id: number;
  uri: string;
  title: string;
  EventId: number;

};

declare type ApiFormContactInfo = {
  id: number;
  name: ?string;
  email: ?string;
  phone: ?string;
  jobTitle: ?string;
  // createdAt: string;
  // updatedAt: string;
  EventId: number;
};

declare type ApiContactInfo = {
  id: number;
  address: string;
  email: ?string;
  phone: ?string;
  link: ?string;
  companyName: ?string;
  // createdAt: string;
  // updatedAt: string;
  EventId: number;
};

declare type ApiEvent = {
  id: number;
  apiID: string;
  title: string;
  description: string;
  latitude: ?number;
  longitude: ?number;
  type: string;
  free: boolean;
  ticketLink: ?string;
  // createdAt: string;
  // updatedAt: string;
  times: Array<ApiTime>;
  image: ApiImage;
  contactInfo: ApiContactInfo;
  formContactInfo: ApiFormContactInfo;
}
