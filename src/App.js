import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import MapView from 'react-native-maps';

const App = () => (
  <View style={styles.container}>
    <MapView
      style={styles.mapView}
    />
  </View>
);


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapView: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default App;
