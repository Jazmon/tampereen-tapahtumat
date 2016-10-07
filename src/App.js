import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import MapView from 'react-native-maps';
import EventMarker from './EventMarker';

const App = () => (
  <View style={styles.container}>
    <MapView
      style={styles.mapView}
      initialRegion={{
        latitude: 61.497452,
        longitude: 23.766331,
        latitudeDelta: 0.0722,
        longitudeDelta: 0.0321,
      }}
    >
      {markers.map((marker, key) => (
        <MapView.Marker coordinate={marker.latlng} key={key}>
          <EventMarker {...marker} key={key} />
        </MapView.Marker>
      ))}
    </MapView>
  </View>
);

const markers = [
  {
    latlng: {
      latitude: 61.497452,
      longitude: 23.766331,
    },
    type: 'debug'
  },
  {
    latlng: {
      latitude: 61.497552,
      longitude: 23.764831,
    },
    type: 'muna',
  }
];


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapView: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default App;
