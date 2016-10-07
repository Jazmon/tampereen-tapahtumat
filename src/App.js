// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  ActivityIndicator,
} from 'react-native';
import MapView from 'react-native-maps';
import 'rxjs';

import {
  requestEvents,
} from './actions';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = 61.497421;
const LONGITUDE = 23.757292;
const LATITUDE_DELTA = 0.0322;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

type Props = {
  events: Array<Marker>;
  isFetching: boolean;
  error: ?Object;
  requestEvents: Function;
};

type State = {
};

class App extends Component {
  props: Props;
  state: State;

  componentDidMount() {
    this.props.requestEvents();
  }

  render() {
    const { events, isFetching, error } = this.props;
    return (
      <View style={styles.container}>
        <MapView
          style={styles.mapView}
          initialRegion={{
            latitude: LATITUDE,
            longitude: LONGITUDE,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }}
        >
          {events.map(event => event ? (
            <MapView.Marker
              key={`marker-${event.id}`}
              coordinate={event.latlng}
              title={event.title}
              description={event.description}
            />
          ) : null)}
        </MapView>
        {isFetching &&
          <View style={styles.loading}>
            <ActivityIndicator
              color="rgb(68, 179, 55)"
              size="large"
            />
          </View>
        }
        {error &&
          <View style={styles.error}>
            <Text>Error loading events :(</Text>
          </View>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapView: {
    ...StyleSheet.absoluteFillObject,
  },
  error: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

// This connects the state received from redux to the components props using a HOC
export default connect(
  (props, ownProps) => ({
    ...props.events,
    ...ownProps,
  }),
  { requestEvents }
)(App);
