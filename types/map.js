/* eslint-disable no-undef */
declare type Region = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}
declare type LatLng = {
  latitude: number;
  longitude: number;
}
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
