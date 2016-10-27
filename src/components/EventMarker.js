// @flow
import React from 'react';
import {
  StyleSheet,
  Image,
  View,
} from 'react-native';

import defaultMarker from '../assets/default-marker.png';
import debugMarker from '../assets/debug-marker.png';

type Props = {
  type: string;
};

type MarkerImage = {
  type: string;
  source: number;
};

const defaultProps = {
  type: 'default',
};

const EventMarker = ({ type }: Props = defaultProps) => {
  const markerImages: Array<MarkerImage> = [{
    type: 'debug',
    source: debugMarker,
  }];

  return (
    <View style={styles.container}>
      <Image
        source={getImagePath(markerImages, type)}
        style={styles.markerImage}
      />
    </View>
  );
};

const getImagePath = (images: Array<MarkerImage>, type: string): number => (
  images.some((image) => image.type === type)
  ? images.filter((image) => image.type === type)[0].source
  : defaultMarker
);

const styles = StyleSheet.create({
  markerImage: {
    transform: [{ scale: 0.5 }],
  },
});

export default EventMarker;
