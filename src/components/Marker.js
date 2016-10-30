// @flow
import React from 'react';
import {
  View,
  Image,
  Text,
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
  onPress: Function;
};

const Marker = (props: Props) => (
  <MapView.Marker
    // key={`marker-${props.id}`}
    coordinate={props.latlng}
    // title={props.title}
    // description={props.description}
    // image={getImagePath(props.type)}
    onPress={props.onPress}
  >
    <Image
      source={getImagePath(props.type)}
      title={props.title}
      description={props.description}
      resizeMode="cover"
      style={{ width: 30, height: 30 }}
    />
    {/* <MapView.Callout>
      <View>
        <Text>{props.title}</Text>
      </View>
    </MapView.Callout> */}
  </MapView.Marker>
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
