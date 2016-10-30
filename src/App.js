// @flow
import React, { Component } from 'react';
// import { connect } from 'react-redux';
import {
  View,
  StyleSheet,
  Dimensions,
  // StatusBar,
  // Platform,
  Text,
  ActivityIndicator,
} from 'react-native';
import MapView from 'react-native-maps';
// import locale from 'react-native-locale-detector';
import moment from 'moment';


import {
  // fetchEvents,
  // getLocation,
  getEvents,
} from './api';
// import {
//   getAddressFromEvent,
// } from './utils';

import Marker from './components/Marker';
import Base from './components/Base';
import Slider from './components/Slider';
// import {
//   requestEvents,
// } from './actions';


const { width, height } = Dimensions.get('window');
// const IOS = Platform.OS === 'ios';
// const ANDROID = Platform.OS === 'android';
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

// const getApiLocale = (locale_: ?string): ?string => {
//   if (!locale_) return null;
//   return locale_.split('-')[0];
// };
//
// const apiLocale = getApiLocale(locale) || 'en';
//
// const apiUrl = 'http://visittampere.fi/api/search?type=event';
// const log = __DEV__ ? console.log.bind(null, '[EventMap]') : () => {};

type Props = {
  // events: Array<Marker>;
  // isFetching: boolean;
  // error: ?Object;
  // requestEvents: Function;
};

type State = {
  // region: Object;
  // date: number;
  // markers: Array<Marker>;
  events: Array<Event>;
  date: number;
  loading: boolean;
};

class App extends Component {
  props: Props;
  map: Object;

  constructor(props: Props) {
    super(props);

    this.state = {
      // region: ANDROID ? new MapView.AnimatedRegion(REGION) : REGION,
      // date: 0,
      date: 0,
      // markers: [],
      events: [],
      loading: false,
    };
  }

  state: State;

  // componentWillMount() {
  //   this.props.requestEvents();
  // }

  componentDidMount() {
    this.loadEvents();

    // const start = moment().startOf('day').valueOf();
    // const end = moment().add(6, 'days').endOf('day').valueOf();
    // const lang = locale ? apiLocale : 'en';
    // const url = `${apiUrl}&limit=20&start_datetime=${start}&end_datetime=${end}&lang=${lang}`;
    // fetchEvents({ url }).then(events => {
    //   const promises = [];
    //   if (!events) return;
    //   const markers = events.map((event, i) => {
    //     const marker: Object = {
    //       id: event.item_id,
    //       title: event.title,
    //       description: event.description,
    //       event,
    //     };
    //     const address = getAddressFromEvent(event);
    //     const promise = getLocation(address);
    //     promises.push(promise);
    //     return marker;
    //   });
    //   Promise.all(promises).then(locations => {
    //     /* eslint-disable no-param-reassign */
    //     markers.forEach((marker, i) => {
    //       if (locations[i]) {
    //         marker.latlng = locations[i];
    //       } else {
    //         marker.latlng = {
    //           latitude: 61.497421,
    //           longitude: 23.757292,
    //         };
    //       }
    //     });
    //     /* eslint-enable no-param-reassign */
    //     const nonNullMarkers = markers.filter((m) => m !== null);
    //     this.setMarkers(nonNullMarkers);

      //   this.setState({ loading: false });
      // });
    // }).catch(err => console.error(err));
  }

  componentDidUpdate() {
    // const coords: Array<LatLng> = this.props.events
    //   // .filter(event => !!event)
    //   .map(event => event.latlng);
    // if (coords.length > 0) {
    //   this.map.fitToCoordinates(coords, {
    //     edgePadding: { top: 40, right: 40, bottom: 40, left: 40 },
    //     animated: true,
    //   });
    // }
  }

  loadEvents = () => {
    this.setState({ loading: true });
    getEvents().then(events => {
      this.setState({
        events,
        loading: false,
      });
    });
  }
  // onRegionChange = (region: Object) => {
  //   if (ANDROID) this.state.region.setValue(region);
  // }

  getCurrentEvents = (): Array<Event> =>
    this.state.events.filter(event => {
      const selectedDate = moment().add(this.state.date, 'days').startOf('day');
      return selectedDate.isSame(event.start, 'day');
      // if (event.single_datetime) {
      //   return selectedDate.isSame(marker.event.start_datetime, 'day');
      // } else {
      //   marker.event.times.forEach(time => {
      //     return selectedDate.isSame(time.start_datetime, 'day');
      //   });
      // }
    });

  eventsToMarkers = (events: Array<Event>): Array<MapMarker> => {
    const getMarker = (event: Event): MapMarker => ({
      id: event.id,
      title: event.title,
      description: event.description,
      latlng: event.latlng,
    });
    return events.map(getMarker);
  };

  // getCurrentMarkers = (): Array<Marker> => {
  //   return this.state.markers.filter(marker => {
  //     const selectedDate = moment().add(this.state.date, 'days').startOf('day');
  //     if (marker.event.single_datetime) {
  //       return selectedDate.isSame(marker.event.start_datetime, 'day');
  //     } else {
  //       marker.event.times.forEach(time => {
  //         return selectedDate.isSame(time.start_datetime, 'day');
  //       });
  //     }
  //   });
  // };

  setDate = (value: number): void => {
    if (value !== this.state.date) {
      this.setState({ date: value });
    }
  };

  // setMarkers = (markers: Array<Marker>): void => {
  //   this.setState({ markers });
  // };

  renderLoading = () => (
    <View style={styles.loading}>
      <ActivityIndicator
        color="rgb(68, 179, 55)"
        size="large"
      />
    </View>
  );

  renderError = () => (
    <View style={styles.error}>
      <Text>Error loading events</Text>
    </View>
  );

  render() {
    // const { events, isFetching, error } = this.props;
    const loading = this.state.loading;

    // const currentMarkers = this.getCurrentMarkers();
    // const { region } = this.state;
    // const currentMarkers = this.getCurrentMarkers();
    // console.log('events', events);
    // const currentMarkers = this.getCurrentEvents().map(this.eventsToMarkers);
    const events = this.getCurrentEvents();
    const currentMarkers = this.eventsToMarkers(events);
    // const eventCount = currentMarkers.length;
    return (
      <Base
        systemBarColor="hsl(116, 70%, 54%)"
      >
        <MapView
          ref={ref => { this.map = ref; }}
          style={styles.mapView}
          // region={region}
          // cacheEnabled={true}
          initialRegion={REGION}
          showsScale={true}
          loadingEnabled={false}
          showsUserLocation={true}
          showsMyLocationButton={true}
          // provider="google"
          // onRegionChange={this.onRegionChange}
        >
          {currentMarkers.map(marker => (
            <Marker {...marker} key={`marker-${marker.id}`} />
          ))}
        </MapView>
        <Slider
          date={this.state.date}
          onValueChange={this.setDate}
        />
        <View style={styles.tabBar}>
          <Text>Foo</Text>
        </View>
        {loading && this.renderLoading()}
        {/* {isFetching && this.renderLoading() }
        {error && this.renderError()} */}
      </Base>
    );
  }
}

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
  tabBar: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: Dimensions.get('window').width,
    height: 48,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
});


export default App;

// This connects the state received from redux to the components props using a HOC
// export default connect(
//   (props, ownProps) => ({
//     ...props.events,
//     ...ownProps,
//   }),
//   { requestEvents }
// )(App);
