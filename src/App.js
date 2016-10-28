// @flow
import React, { Component } from 'react';
// import { connect } from 'react-redux';
import {
  View,
  StyleSheet,
  Dimensions,
  StatusBar,
  Platform,
  Text,
  ActivityIndicator,
} from 'react-native';
import MapView from 'react-native-maps';
import Slider from 'react-native-slider';
import locale from 'react-native-locale-detector';
import moment from 'moment';

import defaultMarker from './assets/default-marker.png';
import debugMarker from './assets/debug-marker.png';

import {
  fetchEvents,
  getLocation,
} from './api';
import {
  getAddressFromEvent,
} from './utils';
import Base from './components/Base';
// import {
//   requestEvents,
// } from './actions';

// This loads moment locales for the language based on the locale.
// Yes, it's ugly but it's the only way :(
/* eslint-disable global-require */
if (locale.startsWith('fi')) {
  require('moment/locale/fi');
} else if (locale.startsWith('se')) {
  require('moment/locale/se');
}
/* eslint-enable global-require */

const { width, height } = Dimensions.get('window');
const IOS = Platform.OS === 'ios';
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


const getApiLocale = (locale_: ?string): ?string => {
  if (!locale_) return null;
  return locale_.split('-')[0];
};

const apiLocale = getApiLocale(locale) || 'en';

const apiUrl = 'http://visittampere.fi/api/search?type=event';
const log = __DEV__ ? console.log.bind(null, '[EventMap]') : () => {};

type Props = {
  // events: Array<Marker>;
  // isFetching: boolean;
  // error: ?Object;
  // requestEvents: Function;
};

type State = {
  // region: Object;
  // date: number;
  markers: Array<Marker>;
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
      markers: [],
      loading: false,
    };
  }

  state: State;

  // componentWillMount() {
  //   this.props.requestEvents();
  // }

  componentDidMount() {
    this.setState({ loading: true });

    const start = moment().startOf('day').valueOf();
    const end = moment().add(6, 'days').endOf('day').valueOf();
    const lang = locale ? apiLocale : 'en';
    const url = `${apiUrl}&limit=20&start_datetime=${start}&end_datetime=${end}&lang=${lang}`;
    fetchEvents({ url }).then(events => {
      const promises = [];
      if (!events) return;
      const markers = events.map((event, i) => {
        const marker: Object = {
          id: event.item_id,
          title: event.title,
          description: event.description,
          event,
        };
        const address = getAddressFromEvent(event);
        const promise = getLocation(address);
        promises.push(promise);
        return marker;
      });
      Promise.all(promises).then(locations => {
        /* eslint-disable no-param-reassign */
        markers.forEach((marker, i) => {
          if (locations[i]) {
            marker.latlng = locations[i];
          } else {
            marker.latlng = {
              latitude: 61.497421,
              longitude: 23.757292,
            };
          }
        });
        /* eslint-enable no-param-reassign */
        const nonNullMarkers = markers.filter((m) => m !== null);
        this.setMarkers(nonNullMarkers);
        this.setState({ loading: false });
      });
    }).catch(err => console.error(err));
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

  // onRegionChange = (region: Object) => {
  //   if (ANDROID) this.state.region.setValue(region);
  // }

  getCurrentMarkers = (): Array<Marker> => {
    return this.state.markers.filter(marker => {
      const selectedDate = moment().add(this.state.date, 'days').startOf('day');
      if (marker.event.single_datetime) {
        return selectedDate.isSame(marker.event.start_datetime, 'day');
      } else {
        marker.event.times.forEach(time => {
          return selectedDate.isSame(time.start_datetime, 'day');
        });
      }
    });
  };

  setDate = (value: number): void => {
    this.setState({ date: value });
  };

  setMarkers = (markers: Array<Marker>): void => {
    this.setState({ markers });
  };

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

    // const currentMarkers = this.getCurrentMarkers();
    const { region } = this.state;
    const currentMarkers = this.getCurrentMarkers();
    const eventCount = currentMarkers.length;
    return (
      <View style={styles.container}>
        <StatusBar
          barStyle="default"
          backgroundColor="#cb47f2"
          // translucent
          animated
        />
        <MapView
          ref={ref => { this.map = ref; }}
          style={styles.mapView}
          // region={region}
          // cacheEnabled={true}
          initialRegion={REGION}
          showsScale={true}
          loadingEnabled={true}
          showsUserLocation={true}
          showsMyLocationButton={true}
          // provider="google"
          // onRegionChange={this.onRegionChange}
        >
          {currentMarkers.map(event => (
            <MapView.Marker
              key={`marker-${event.id}`}
              coordinate={event.latlng}
              title={event.title}
              description={event.description}
              image={getImagePath(event.type)}
            />
          ))}
        </MapView>
        <View style={styles.sliderBox}>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={6}
            onValueChange={this.setDate}
            thumbTintColor="#304FFE"
            minimumTrackTintColor="rgba(0, 0, 0, 0.47)"
            maximumTrackTintColor="rgba(0, 0, 0, 0.47)"
            step={1}
            value={this.state.date}
          />
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginHorizontal: 6,
          }}
          >
            {[0, 1, 2, 3, 4, 5, 6].map(val => (
              <View
                key={`asd-${val}`}
                style={{

                }}
              >
                <Text style={{
                  color: this.state.date === val ? '#fff' : '#000',
                }}
                >{moment().add(val, 'days').startOf('day').format('dd')}</Text>
              </View>
            ))}
          </View>
        </View>
        {/* {isFetching && this.renderLoading }
        {error && this.renderError} */}
      </View>
    );
  }
}

const getImagePath = (type) => {
  const markerImages = [
    { type: 'debug',
      source: debugMarker,
    },
  ];

  return markerImages.some((image) => image.type === type)
  ?
  markerImages.filter((image) => image.type === type)[0].source
  :
  defaultMarker;
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#b5b5b5',
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
  slider: {
  },
  sliderBox: {
    marginHorizontal: 24,
    marginTop: 8,
    borderRadius: 2,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    flex: 0,
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
