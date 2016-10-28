// @flow
import React from 'react';
import {
  View,
} from 'react-native';
import MapView from 'react-native-maps';

import defaultMarker from '../assets/default-marker.png';
import debugMarker from '../assets/debug-marker.png';

type Props = {
  // id: string;
  latlng: LatLng;
  title: string;
  description: string;
  type: string;
};

const Marker = (props: Props) => (
  <MapView.Marker
    // key={`marker-${props.id}`}
    coordinate={props.latlng}
    title={props.title}
    description={props.description}
    image={getImagePath(props.type)}
  />
);


const getImagePath = (type: string) => {
  const markerImages = [
    { type: 'debug',
      source: debugMarker,
    },
  ];

  return markerImages.some((image) => image.type === type)
    ? markerImages.filter((image) => image.type === type)[0].source
    : defaultMarker;
};


export default Marker;
