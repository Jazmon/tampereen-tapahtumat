// @flow
import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Platform,
  findNodeHandle,
  Animated,
  Text,
  ToastAndroid,
  StatusBar,
  AsyncStorage,
  NativeModules,
  Linking,
} from 'react-native';

import MapView from 'react-native-maps';
// import * as Animatable from 'react-native-animatable';
import moment from 'moment';
// import Spinner from 'react-native-spinkit';
import NavigationBar from 'react-native-onscreen-navbar';
import _ from 'lodash';
import {
  CoordinatorLayout,
  BottomSheetBehavior,
} from 'react-native-bottom-sheet-behavior';
import { Lokka } from 'lokka';
import { Transport } from 'lokka-transport-http';

import {
  getEvents,
} from './api';

import {
  eventsToMarkers,
  getCurrentEvents,
} from './utils';

import {
  PRIMARY_COLOR,
  DARK_PRIMARY_COLOR,
} from './theme';
import mapStyle from './mapStyle.json';

// import {
//   // Base,
//   Marker,
//   Loading,
//   BottomSheet,
//   Slider,
//   FloatingActionButton,
// } from './components';
import Marker from './components/Marker';
import Loading from './components/Loading';
import BottomSheet from './components/BottomSheet';
import Slider from './components/Slider';
import FloatingActionButton from './components/FloatingActionButton';

const DURATION = 120;
const client = new Lokka({
  transport: new Transport('https://vast-hollows-14109.herokuapp.com/graphql')
});
const { Calendar } = NativeModules;

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

type Props = {
};

type State = {
  events: Array<ApiEvent>;
  date: number;
  loading: boolean;
  region: Object;
  activeEvent: ?Event;

  bottomSheetColor: number;
  bottomSheetColorAnimated: Object;
};

class App extends Component {
  props: Props;
  map: Object;
  fab: Object;
  bottomSheet: Object;
  lastState: number;
  settlingExpanded: boolean;
  offset: number;
  loadingView: Object;

  constructor(props: Props) {
    super(props);

    this.state = {
      region: ANDROID ? new MapView.AnimatedRegion(REGION) : REGION,
      date: 0,
      activeEvent: null,
      events: [],
      loading: false,
      bottomSheetColor: 0,
      bottomSheetColorAnimated: new Animated.Value(0),
    };
  }

  state: State;

  componentDidMount() {
    this.loadEvents();

    this.lastState = BottomSheetBehavior.STATE_COLLAPSED;
    this.fab.setAnchor(findNodeHandle(this.bottomSheet));
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (prevState.loading && !this.state.loading) {
      this.loadingView.hide();
    }

    if (!_.isEqual(prevState.date, this.state.date)) {
      const PAD_AMOUNT = 60;
      const edgePadding: EdgePadding = {
        top: PAD_AMOUNT,
        right: PAD_AMOUNT,
        bottom: PAD_AMOUNT,
        left: PAD_AMOUNT,
      };
      const coords: Array<LatLng> = getCurrentEvents(this.state.events, this.state.date)
        .map(event => event.latlng);
      // TODO check the delta between events and if less than reasonable amount,
      // use padding to compensate
      // and if only one event, use some other value
      if (coords && coords.length > 1) {
        this.map.fitToCoordinates(coords, { edgePadding, animated: true });
      }
    }
  }

  handleFabPress = () => {
    const { activeEvent } = this.state;
    if (activeEvent) {
      Calendar.insertEvent({
        start: activeEvent.start,
        end: activeEvent.end,
        title: activeEvent.title,
        description: activeEvent.description,
        location: activeEvent.contactInfo.address,
      });
    }
  }

  handleBottomSheetOnPress = () => {
    if (this.lastState === BottomSheetBehavior.STATE_COLLAPSED) {
      this.setState({ bottomSheetColor: 1 });
      this.bottomSheet.setBottomSheetState(BottomSheetBehavior.STATE_EXPANDED);
    } else if (this.lastState === BottomSheetBehavior.STATE_EXPANDED) {
      this.setState({ bottomSheetColor: 0 });
      this.bottomSheet.setBottomSheetState(BottomSheetBehavior.STATE_COLLAPSED);
    }
  }

  handleBottomSheetChange = (e: Object) => {
    const newState = e.nativeEvent.state;

    if (this.offset > 0.1 &&
      newState === BottomSheetBehavior.STATE_DRAGGING ||
      newState === BottomSheetBehavior.STATE_EXPANDED) {
      this.setState({ bottomSheetColor: 1 });
    }
    if (newState === BottomSheetBehavior.STATE_SETTLING && !this.settlingExpanded) {
      this.setState({ bottomSheetColor: 0 });
    }

    this.lastState = newState;
  }

  handleSlide = (e: Object) => {
    const { bottomSheetColor } = this.state;
    const offset = parseFloat(e.nativeEvent.offset.toFixed(2));

    this.settlingExpanded = offset >= this.offset;
    this.offset = offset;

    if (offset === 0) {
      this.setState({ bottomSheetColor: 0 });
    } else if (bottomSheetColor !== 1 &&
      this.lastState === BottomSheetBehavior.STATE_DRAGGING) {
      this.setState({ bottomSheetColor: 1 });
    }
  }

  handleOpenUrl = () => {
    const url: ?string = _.get(this.state, 'activeEvent.contactInfo.link');
    if (url) {
      Linking.canOpenURL(url).then(supported => {
        if (supported) {
          Linking.openURL(url);
        }
      });
    }
  }

  handleOpenNavigation = () => {
    const lat: ?number = _.get(this.state, 'activeEvent.latlng.latitude');
    const long: ?number = _.get(this.state, 'activeEvent.latlng.longitude');
    if (lat && long) {
      const url: string = `http://maps.google.com/maps?daddr=${lat},${long}&amp;ll=`;
      Linking.canOpenURL(url).then(supported => {
        if (supported) {
          Linking.openURL(url);
        } else {
          ToastAndroid.show('Cannot open navigation for this event', ToastAndroid.SHORT);
        }
      });
    } else {
      ToastAndroid.show('Cannot open navigation for this event', ToastAndroid.SHORT);
    }
  }

  loadEvents = async () => {
    // const prefix = 'TampereenTapahtumat';
    // const key = `${prefix}:cache`;
    this.setState({ loading: true });

    const imageFragment = client.createFragment(`
      fragment on Event {
        image {
          uri
          title
        }
      }
    `);

    client.query(`
      {
        events {
          id
          title
          description
          latitude
          longitude
          type
          free
          ticketLink
          times {
            start
            end
          }
          ...${imageFragment}
          contactInfo {
            address
            link
            email
          }
        }
      }
    `).then(result => {
      const events = result.events.map(event => ({
        ...event,
        times: event.times.map(time => ({
          start: parseInt(time.start, 10),
          end: parseInt(time.end, 10),
        })),
      }));
      this.setState({ events, loading: false });
    });
    // // load cached data
    // try {
    //   const loadedCache = await AsyncStorage.getItem(key);
    //   if (loadedCache !== null) {
    //     const parsedCache = JSON.parse(loadedCache);
    //     const oneDay = moment().add(1, 'days');
    //     if (moment().isSameOrBefore(oneDay)) {
    //       this.setState({
    //         events: parsedCache.events,
    //         loading: false,
    //       });
    //     }
    //   }
    // } catch (e) {
    //   console.error(e.message, e);
    // }
    // load fresh data
    // getEvents().then(events => {
    //   this.setState({
    //     events,
    //     loading: false,
    //   });
    //   const cache = {
    //     events,
    //     time: Date.now(),
    //   };
    //   AsyncStorage.setItem(key, JSON.stringify(cache));
    // });
  }

  setDate = (value: number) => {
    if (value !== this.state.date) {
      this.setState({ date: value, activeEvent: null });
    }
  };

  markerPressed = (marker: MapMarker) => {
    const event: ?Event = this.state.events
      .filter(e => e.id === marker.id)[0];
    this.setState({ activeEvent: event });
  }

  renderError = () => (
    <View style={styles.error}>
      <Text>Error loading events</Text>
    </View>
  );

  renderMap = () => {
    // const events: Array<Event> = getCurrentEvents(this.state.events, this.state.date);
    const events = this.state.events
      .filter(event => {
        const length = event.times.length;
        for (let i = 0; i < length; i++) {
          const time = event.times[i];
          const selectedDate = moment().add(this.state.date, 'days').startOf('day');
          const sameDay = selectedDate.isSame(parseInt(time.start, 10), 'day');
          if (sameDay) {
            console.log('same day');
            return true;
          }
        }
        return false;
      })
      .filter(event => !!event.latitude && !!event.longitude);
    console.log('events.length', events.length);
    // const currentMarkers: Array<MapMarker> = eventsToMarkers(events);

    return (
      <View style={styles.mapContainer}>
        <MapView
          ref={ref => { this.map = ref; }}
          style={styles.mapView}
          onPress={() => this.setState({ activeEvent: null })}
          initialRegion={REGION}
          // showsScale={true}
          loadingEnabled={false}
          showsUserLocation={true}
          showsMyLocationButton={true}
          showsCompass={false}
          customMapStyle={mapStyle}
          toolbarEnabled={true}
        >
          {events.map((event) =>
            <Marker
              id={event.id}
              latlng={{ latitude: event.latitude, longitude: event.longitude }}
              title={event.title}
              description={event.description}
              type={event.type}
              key={event.id}
              onPress={this.markerPressed}
            />
          )}
        </MapView>
      </View>
    );
  };

  renderBottomSheet = () => {
    const {
      bottomSheetColor,
      bottomSheetColorAnimated,
    } = this.state;

    Animated.timing(bottomSheetColorAnimated, {
      duration: DURATION,
      toValue: bottomSheetColor,
    }).start();

    const { activeEvent } = this.state;
    return (
      <BottomSheetBehavior
        ref={bs => { this.bottomSheet = bs; }}
        // elevation={16}
        elevation={activeEvent ? 16 : 0}
        onSlide={this.handleSlide}
        // hideable
        onStateChange={this.handleBottomSheetChange}
        peekHeight={80}
      >
        <BottomSheet
          activeEvent={activeEvent}
          openUrl={this.handleOpenUrl}
          openNavigation={this.handleOpenNavigation}
          bottomSheetColorAnimated={bottomSheetColorAnimated}
          bottomSheetColor={bottomSheetColor}
          onPress={this.handleBottomSheetOnPress}
        />
      </BottomSheetBehavior>
    );
  }

  render() {
    const { bottomSheetColor, activeEvent } = this.state;

    return (
      <CoordinatorLayout style={styles.container}>
        <StatusBar
          backgroundColor={DARK_PRIMARY_COLOR}
          animated={true}
          barStyle="default"
          translucent={false}
        />
        <NavigationBar
          backgroundColor={PRIMARY_COLOR}
          animated={true}
          translucent={false}
        />
        <View style={styles.content}>
          {this.renderMap()}
          <Slider
            date={this.state.date}
            onValueChange={this.setDate}
          />
        </View>
        {this.renderBottomSheet()}
        <FloatingActionButton
          ref={fab => { this.fab = fab; }}
          onPress={this.handleFabPress}
          active={!!activeEvent}
          elevation={18}
          expanded={bottomSheetColor === 1}
        />
        <Loading ref={view => { this.loadingView = view; }} />
      </CoordinatorLayout>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5FCFF',
    // flex: 1,
    // flexGrow: 1,

    width,
    height: height - 24,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  content: {
    // borderColor: '#f00', borderWidth: 1,
    // flex: 1,
    // flexGrow: 1,
    // paddingTop: 24,
    // width,
    // height,
    backgroundColor: 'transparent',
  },
  mapView: {
    // ...StyleSheet.absoluteFillObject,

    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  mapContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width,
    height: height - StatusBar.currentHeight,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  error: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
