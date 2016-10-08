// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  View,
  StyleSheet,
  Dimensions,
  StatusBar,
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
  region: Object;
};

class App extends Component {
  props: Props;
  map: Object;

  constructor(props: Props) {
    super(props);

    this.state = {
      region: new MapView.AnimatedRegion({
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      }),
    };
  }

  state: State;

  componentDidMount() {
    this.props.requestEvents();
  }

  componentDidUpdate() {
    const coords: Array<LatLng> = this.props.events
      // .filter(event => !!event)
      .map(event => event.latlng);
    if (coords.length > 0) {
      this.map.fitToCoordinates(coords, {
        edgePadding: { top: 40, right: 40, bottom: 40, left: 40 },
        animated: true,
      });
    }
  }

  onRegionChange = (region) => {
    this.state.region.setValue(region);
  }

  render() {
    const { events, isFetching, error } = this.props;
    const { region } = this.state;
    return (
      <View style={styles.container}>
        <StatusBar
          barStyle="default"
          backgroundColor="rgba(0, 0, 0, 0.25)"
          translucent
          animated
        />
        <MapView
          ref={ref => { this.map = ref; }}
          style={styles.mapView}
          region={region}
          onRegionChange={this.onRegionChange}
        >
          {events.map(event => (
            <MapView.Marker
              key={`marker-${event.id}`}
              coordinate={event.latlng}
              title={event.title}
              description={event.description}
            />
          ))}
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
