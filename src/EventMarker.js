import React from 'react';

import {
  StyleSheet,
  Image,
  View,
} from 'react-native';

import defaultMarker from './assets/default-marker.png';
import debugMarker from './assets/debug-marker.png';

const EventMarker = ({ type }) => {
  const markerImages = [
    { type: 'debug',
      source: debugMarker,
    },
  ];

  return (
    <View style={styles.container}>
      <Image
        source={getImagePath(markerImages, type)}
        style={styles.markerImage}
      />
    </View>
  );
};

const getImagePath = (markerImages, type) =>
  markerImages.some((image) => image.type === type)
  ?
  markerImages.filter((image) => image.type === type)[0].source
  :
  defaultMarker;

EventMarker.propTypes = {
  type: React.PropTypes.string.isRequired,
};

EventMarker.defaultProps = {
  type: 'default',
};

const styles = StyleSheet.create({
  markerImage: {
    transform: [{ scale: 0.5 }],
  },
});

export default EventMarker;
