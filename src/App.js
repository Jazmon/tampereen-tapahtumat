// @flow
import React, { Component } from 'react';
// import { connect } from 'react-redux';
import {
  View,
  StyleSheet,
  Dimensions,
  Platform,
  TouchableNativeFeedback,
  Text,
  ActivityIndicator,
  AsyncStorage,
} from 'react-native';
import MapView from 'react-native-maps';
import moment from 'moment';

import {
  getEvents,
} from './api';

import {
  eventsToMarkers,
  getCurrentEvents,
} from './utils';

import Marker from './components/Marker';
import Base from './components/Base';
import Slider from './components/Slider';


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

// const log = __DEV__ ? console.log.bind(null, '[EventMap]') : () => {};

type Props = {
};

type State = {
  events: Array<Event>;
  date: number;
  loading: boolean;
  region: Object;
  activeEvent: ?Event;
  toolbarExpanded: boolean;
  // toolbarHeight: number;
};

class App extends Component {
  props: Props;
  map: Object;

  constructor(props: Props) {
    super(props);

    this.state = {
      region: ANDROID ? new MapView.AnimatedRegion(REGION) : REGION,
      date: 0,
      activeEvent: null,
      events: [],
      loading: false,
      // toolbarHeight: 48,
      toolbarExpanded: false,
    };
  }

  state: State;

  componentWillMount() {
  }

  componentDidMount() {
    this.loadEvents();
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    // if (prevState.events !== this.state.events) {
    //
    // }
    const edgePadding: EdgePadding = {
      top: 40,
      right: 40,
      bottom: 40,
      left: 40,
    };
    const coords: Array<LatLng> = getCurrentEvents(this.state.events, this.state.date)
      // .filter(event => !!event)
      .map(event => event.latlng);
    // TODO check the delta between events and if less than reasonable amount,
    // use padding to compensate
    // and if only one event, use some other value
    if (coords.length > 0) {
      this.map.fitToCoordinates(coords, edgePadding,
        true,
      );
    }
  }

  loadEvents = async() => {
    const prefix = 'TampereenTapahtumat';
    const key = `${prefix}:cache`;
    this.setState({ loading: true });
    // load cached data
    try {
      const loadedCache = await AsyncStorage.getItem(key);
      if (loadedCache !== null) {
        const parsedCache = JSON.parse(loadedCache);
        const oneDay = moment().add(1, 'days');
        if (moment().isSameOrBefore(oneDay)) {
          this.setState({
            events: parsedCache.events,
            loading: false,
          });
        }
      }
    } catch (e) {
      console.error(e.message, e);
    }
    // load fresh data
    getEvents().then(events => {
      this.setState({
        events,
        loading: false,
      });
      const cache = {
        events,
        time: Date.now(),
      };
      AsyncStorage.setItem(key, JSON.stringify(cache));
    });
  }

  onRegionChange = (region: Object) => {
    if (ANDROID) this.state.region.setValue(region);
  }

  setDate = (value: number) => {
    if (value !== this.state.date) {
      this.setState({ date: value, activeEvent: null });
    }
  };

  markerPressed = (marker: MapMarker) => {
    const event: ?Event = this.state.events
      .filter(e => e.id === marker.id)[0];
    // if (!event) { return; }
    this.setState({ activeEvent: event });
  }

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

  renderToolbar = (event: Event) => {
    const toolbarHeight = this.state.toolbarExpanded ? height - 24 : 48;
    return (
      <TouchableNativeFeedback
        onPress={() => {
          const bool = !this.state.toolbarExpanded;
          this.setState({
            toolbarExpanded: bool,
          });
        }}
        background={TouchableNativeFeedback.SelectableBackground()}
      >
        <View style={[styles.toolbar, { height: toolbarHeight }]}>
          <View style={{ }}>
            <Text>{event.title}</Text>
          </View>
          {this.state.toolbarExpanded &&
            <View>
              <Text>{event.description}</Text>
            </View>
          }
        </View>
      </TouchableNativeFeedback>
    );
  };

  render() {
    const loading: boolean = this.state.loading;
    // const showToolbar: boolean = !!this.state.activeEvent;
    const events: Array<Event> = getCurrentEvents(this.state.events, this.state.date);
    const currentMarkers: Array<MapMarker> = eventsToMarkers(events);
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
          {currentMarkers.map((marker, i) => (
            <Marker
              {...marker}
              key={`marker-${marker.id}`}
              type={i % 2 === 0 ? 'debug' : 'default'}
              onPress={() => this.markerPressed(marker)}
            />
          ))}
        </MapView>
        <Slider
          date={this.state.date}
          onValueChange={this.setDate}
        />
        {!!this.state.activeEvent &&
          this.renderToolbar(this.state.activeEvent)
        }
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
  toolbar: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: Dimensions.get('window').width,
    height: 48,
    backgroundColor: '#fff',
    // justifyContent: 'center',
    // alignItems: 'center',
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
