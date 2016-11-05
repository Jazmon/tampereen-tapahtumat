// @flow
import React, { Component } from 'react';
// import { connect } from 'react-redux';
/* eslint-disable no-unused-vars */
import {
  View,
  StyleSheet,
  Dimensions,
  Platform,
  Animated,
  Easing,
  Text,
  ToastAndroid,
  Keyboard,
  TouchableWithoutFeedback,
  TouchableNativeFeedback,
  ActivityIndicator,
  AsyncStorage,
} from 'react-native';
/* eslint-enable no-unused-vars */

import MapView from 'react-native-maps';
import moment from 'moment';
import Icon from 'react-native-vector-icons/Ionicons';
import IconMDI from 'react-native-vector-icons/MaterialIcons';
import {
  NestedScrollView,
  CoordinatorLayout,
  BottomSheetBehavior,
  FloatingActionButton,
} from 'react-native-bottom-sheet-behavior';

import {
  getEvents,
} from './api';

import {
  eventsToMarkers,
  getCurrentEvents,
} from './utils';

import Marker from './components/Marker';
import Base from './components/Base';
import Toolbar from './components/Toolbar';
import Slider from './components/Slider';

const AnimatedIcon = Animated.createAnimatedComponent(Icon);

const duration = 120;

const RippleColor = (...args) =>
  Platform.Version >= 21
    ? TouchableNativeFeedback.Ripple(...args)
    : null;

const { width, height } = Dimensions.get('window');
// const IOS = Platform.OS === 'ios';
const ANDROID = Platform.OS === 'android';
const ASPECT_RATIO = width / height;
const LATITUDE = 61.497421;
const LONGITUDE = 23.757292;
const LATITUDE_DELTA = 0.0322;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const WHITE = '#FFF';
const PRIMARY_COLOR = '#4589f2';
const TEXT_BASE_COLOR = '#333';
const SECONDARY_COLOR = '#ff5722';

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

  bottomSheetColor: number;
  bottomSheetColorAnimated: Object;
  lastState: number;
  offset: number;
  settlingExpanded: boolean;
};

class App extends Component {
  props: Props;
  map: Object;
  fab: ?Object;
  bottomSheet: ?Object;

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
      lastState: BottomSheetBehavior.STATE_COLLAPSED,
      offset: 0,
      settlingExpanded: false,
    };
  }

  state: State;

  componentWillMount() {
  }

  componentDidMount() {
    this.loadEvents();
    this.setState({
      lastState: BottomSheetBehavior.STATE_COLLAPSED,
    });

    if (this.fab && this.bottomSheet) {
      this.fab.setAnchorId(this.bottomSheet);
    }
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
    // if (!!this.map && coords && coords.length > 1) {
    //   this.map.fitToCoordinates(coords, edgePadding,
    //     true,
    //   );
    // }
  }

  handleFabPress = () => {
    ToastAndroid.show('Pressed', ToastAndroid.SHORT);
  }

  handleBottomSheetOnPress = (e: Object) => {
    console.log('bottom sheet pressed');
    if (this.state.lastState === BottomSheetBehavior.STATE_COLLAPSED) {
      this.setState({ bottomSheetColor: 1 });
      if (this.bottomSheet) this.bottomSheet.setBottomSheetState(BottomSheetBehavior.STATE_EXPANDED);
    } else if (this.state.lastState === BottomSheetBehavior.STATE_EXPANDED) {
      this.setState({ bottomSheetColor: 0 });
      if (this.bottomSheet) this.bottomSheet.setBottomSheetState(BottomSheetBehavior.STATE_STATE_COLLAPSED);
    }
  }

  handleBottomSheetChange = (e: Object) => {
    const newState = e.nativeEvent.state;

    if (this.state.offset > 0.1 &&
      newState === BottomSheetBehavior.STATE_DRAGGING ||
      newState === BottomSheetBehavior.STATE_EXPANDED) {
      this.setState({ bottomSheetColor: 1 });
    }
    if (newState === BottomSheetBehavior.STATE_SETTLING && !this.state.settlingExpanded) {
      this.setState({ bottomSheetColor: 0 });
    }

    this.setState({ lastState: newState });
  }

  handleSlide = (e: Object) => {
    // const { bottomSheetColor } = this.state;
    const offset = parseFloat(e.nativeEvent.offset.toFixed(2));

    // this.settlingExpanded = offset >= this.offset;
    // this.offset = offset;

    let bottomSheetColor = 0;

    if (offset === 0) {
      bottomSheetColor = 0;
      // this.setState({ bottomSheetColor: 0 });
    } else if (this.state.bottomSheetColor !== 1 && this.state.lastState === BottomSheetBehavior.STATE_DRAGGING) {
      // this.setState({ bottomSheetColor: 1 });
      bottomSheetColor = 1;
    }

    this.setState({
      bottomSheetColor,
      settlingExpanded: offset >= this.state.offset,
      offset,
    });
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
            // loading: false,
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

  renderMap = () => {
    const events: Array<Event> = getCurrentEvents(this.state.events, this.state.date);
    const currentMarkers: Array<MapMarker> = eventsToMarkers(events);
    return (
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
    );
  };

  renderBottomSheet = () => {
    const {
      bottomSheetColor,
      bottomSheetColorAnimated,
    } = this.state;

    Animated.timing(bottomSheetColorAnimated, {
      duration,
      toValue: bottomSheetColor,
    }).start();

    const headerAnimated = {
      backgroundColor: bottomSheetColorAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [WHITE, PRIMARY_COLOR],
      }),
    };

    const textAnimated = {
      color: bottomSheetColorAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [TEXT_BASE_COLOR, WHITE],
      }),
    };
    const starsAnimated = {
      color: bottomSheetColorAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [SECONDARY_COLOR, WHITE],
      }),
    };
    const routeTextAnimated = {
      color: bottomSheetColorAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [PRIMARY_COLOR, WHITE],
      }),
    };

    return (
      <BottomSheetBehavior
        ref={bs => { this.bottomSheet = bs; }}
        // ref="bottomSheet"
        elevation={16}
        onSlide={this.handleSlide}
        onStateChange={this.handleBottomSheetChange}
        peekHeight={90}
      >
        <View style={styles.bottomSheet}>
          <TouchableWithoutFeedback
            onPress={this.handleBottomSheetOnPress}
          >
            <Animated.View style={[styles.bottomSheetHeader, headerAnimated]}>
              <Text>Peek a boo</Text>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </BottomSheetBehavior>
    );
  }

  renderFloatingActionButton = () => {
    const { bottomSheetColor } = this.state;
    const isExpanded = bottomSheetColor === 1;
    return (
      <FloatingActionButton
        // ref="fab"
        ref={fab => { this.fab = fab; }}
        elevation={18}
        rippleEffect={true}
        icon="directions"
        iconProvider={IconMDI}
        iconColor={!isExpanded ? WHITE : PRIMARY_COLOR}
        onPress={this.handleFabPress}
        backgroundColor={isExpanded ? WHITE : PRIMARY_COLOR}
      />
    );
  }

  render() {
    const loading: boolean = this.state.loading;

    return (
      <Base
        systemBarColor="hsl(116, 70%, 54%)"
      >
        <CoordinatorLayout style={{ flex: 1 }}>
          <View style={styles.content}>
            {this.renderMap()}
            <Slider
              date={this.state.date}
              onValueChange={this.setDate}
            />
          </View>
          {this.renderBottomSheet()}
          {this.renderFloatingActionButton()}
        </CoordinatorLayout>

        {/* {!!this.state.activeEvent && <Toolbar event={this.state.activeEvent} />} */}
        {/* {loading && this.renderLoading()} */}
        {/* {isFetching && this.renderLoading() }
        {error && this.renderError()} */}
      </Base>
    );
  }
}

const styles = StyleSheet.create({
  mapView: {
    ...StyleSheet.absoluteFillObject,
    // justifyContent: 'flex-end',
    // alignItems: 'center',
  },
  content: {
    backgroundColor: 'transparent',
    flex: 1,
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
  bottomSheet: {
    zIndex: 5,
    backgroundColor: 'transparent',
  },
  bottomSheetHeader: {
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
