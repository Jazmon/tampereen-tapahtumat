// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  View,
  StyleSheet,
  Dimensions,
  Platform,
  Text,
  ActivityIndicator,
} from 'react-native';
import MapView from 'react-native-maps';
import _ from 'lodash';
import 'rxjs';

import CustomCallout from './components/CustomCallout';
import Base from './components/Base';
import SliderBox from './components/SliderBox';

import {
  requestEvents,
  selectDate,
} from './actions';

const { width, height } = Dimensions.get('window');
// const IOS = Platform.OS === 'ios';
const ANDROID = Platform.OS === 'android';
const ASPECT_RATIO = width / height;
const LATITUDE = 61.497421;
const LONGITUDE = 23.757292;
const LATITUDE_DELTA = 0.0322;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const REGION = {
  latitude: LATITUDE,
  longitude: LONGITUDE,
  latitudeDelta: LATITUDE_DELTA,
  longitudeDelta: LONGITUDE_DELTA,
};

const getTempEvents = ({ eventCount } = { eventCount: 4 }) =>
  _.range(eventCount).map((n, i) => ({
    latlng: {
      latitude: LATITUDE + Math.random() / 100,
      longitude: LONGITUDE + Math.random() / 100,
    },
    id: i,
    title: `Marker ${i}`,
    description: '',
  })
);

const TEMP_EVENTS = getTempEvents();
type Props = {
  // events: Array<Marker>;
  date: number;
  eventsByDate: Object;
  isFetching: boolean;
  error: ?Object;
  requestEvents: Function;
  selectDate: Function;
};

type State = {
  region: Object;
  date: number;
  marker: ?Marker
};

class App extends Component {
  props: Props;
  map: Object;

  constructor(props: Props) {
    super(props);

    this.state = {
      region: ANDROID ? new MapView.AnimatedRegion(REGION) : REGION,
      date: 0,
      marker: null,
    };
  }

  state: State;

  componentWillMount() {
    this.props.requestEvents(this.props.date);
  }

  componentDidUpdate() {
    if (this.props.eventsByDate[this.props.date]) {
      const coords: Array<LatLng> = this.props.eventsByDate[this.props.date].items
        .map(event => event.latlng);
      if (coords.length > 0) {
        if (this.map.fitToCoordinates) {
          this.map.fitToCoordinates(coords, {
            edgePadding: { top: 40, right: 40, bottom: 40, left: 40 },
            animated: true,
          });
        }
      }
    }
  }

  onRegionChange = (region) => {
    if (ANDROID) this.state.region.setValue(region);
  }

  setDate = (value: number): void => {
    // this.setState({ date: value });
    this.props.selectDate(value);
  };

  // setActiveMarker = ({ event, coordinate, position }:
  //   { event: Marker; coordinate: LatLng; position: Point; }
  // ) => {
  //   this.setState({ marker: event });
  // }

  render() {
    const { eventsByDate, date } = this.props;
    const { region } = this.state;
    const loading = !eventsByDate[date] || eventsByDate[date].isFetching;
    const error = !!eventsByDate[date] && eventsByDate[date].error;
    return (
      <Base>
        <MapView.Animated
          ref={ref => { this.map = ref; }}
          style={styles.mapView}
          // region={region}
          showsScale={true}
          loadingEnabled={false}
          toolbarEnabled={true}
          showsUserLocation={true}
          showsMyLocationButton={true}
          // cacheEnabled={true}
          initialRegion={REGION}
          // provider="google"
          // onRegionChange={this.onRegionChange}
        >
          {eventsByDate[date] && eventsByDate[date].items.map(event => (
            <MapView.Marker.Animated
              key={`marker-${event.id}`}
              coordinate={event.latlng}
              title={event.title}
              description={event.description}
              // onPress={({ coordinate, position }) =>
              //   this.setActiveMarker({ event, coordinate, position })}
              // calloutOffset={{ x: -8, y: 28 }}
              // calloutAnchor={{ x: 0.5, y: 0.4 }}

              // image={getImagePath(event.type)}
            >
              <MapView.Callout tooltip={true} >
                <CustomCallout>
                  <Text>Event: {event.title}</Text>
                </CustomCallout>
              </MapView.Callout>
            </MapView.Marker.Animated>
          ))}
        </MapView.Animated>
        <SliderBox
          // value={this.state.date}
          value={this.props.date}
          onValueChange={this.setDate}
        />

        {loading &&
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
        {this.state.marker && <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 64, backgroundColor: '#b5b5b5' }}>
          <View>
            <Text>{this.state.marker.title}</Text>
          </View>
        </View>}
      </Base>
    );
  }
}

// const getImagePath = (type) => {
//   const markerImages = [
//     { type: 'debug',
//       source: debugMarker,
//     },
//   ];
//
//   return markerImages.some((image) => image.type === type)
//   ? markerImages.filter((image) => image.type === type)[0].source
//   : defaultMarker;
// };


const styles = StyleSheet.create({
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
    ...props,
    ...ownProps,
  }),
  { requestEvents, selectDate }
)(App);
