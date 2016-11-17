/* eslint-disable no-undef */
declare type Region = {
  latitude: number | Object;
  longitude: number | Object;
  latitudeDelta: number;
  longitudeDelta: number;
}

declare type LatLng = {
  latitude: number;
  longitude: number;
};

declare type MapMarker = {
  latlng: LatLng;
  id: number | string;
  title: string;
  type: string;
  description: string;
};

declare type Point = {
  x: number;
  y: number;
}
declare type MapType =
  "standard" |
  "satellite" |
  "hybrid" |
  "terrain"; // Android only

declare type EdgePadding = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};
