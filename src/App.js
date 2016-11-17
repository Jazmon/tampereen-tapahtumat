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
  StatusBar,
  TouchableWithoutFeedback,
  TouchableNativeFeedback,
  ActivityIndicator,
  AsyncStorage,
  Image,
  NativeModules,
  Linking,
} from 'react-native';
/* eslint-enable no-unused-vars */

import MapView from 'react-native-maps';
import * as Animatable from 'react-native-animatable';
import moment from 'moment';
import Spinner from 'react-native-spinkit';
import NavigationBar from 'react-native-onscreen-navbar';
import Icon from 'react-native-vector-icons/Ionicons';
import IconMDI from 'react-native-vector-icons/MaterialIcons';
import _ from 'lodash';
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
// import Base from './components/Base';
// import Toolbar from './components/Toolbar';
import Slider from './components/Slider';

// const AnimatedIcon = Animated.createAnimatedComponent(Icon);

const duration = 120;

const { Calendar } = NativeModules;

const rippleColor = (...args) =>
  Platform.Version >= 21 &&
    TouchableNativeFeedback.Ripple(...args)
    || null;

const { width, height } = Dimensions.get('window');
// const IOS = Platform.OS === 'ios';
const ANDROID = Platform.OS === 'android';
const ASPECT_RATIO = width / height;
const LATITUDE = 61.497421;
const LONGITUDE = 23.757292;
const LATITUDE_DELTA = 0.0322;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const WHITE = '#FFFFFF';
const PRIMARY_COLOR = '#2196F3';
const DARK_PRIMARY_COLOR = '#1976D2';
const LIGHT_PRIMARY_COLOR = '#BBDEFB';
const TEXT_BASE_COLOR = 'rgba(0, 0, 0, 0.87)';
// const SECONDARY_TEXT_COLOR = 'rgba(0, 0, 0, 0.54)';
const SECONDARY_COLOR = '#FF3F80';
const REGION = {
  latitude: LATITUDE,
  longitude: LONGITUDE,
  latitudeDelta: LATITUDE_DELTA,
  longitudeDelta: LONGITUDE_DELTA,
};

// const log = __DEV__ ? // console.log.bind(null, '[EventMap]') : () => {};

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
  // lastState: number;
  // offset: number;
  // settlingExpanded: boolean;
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
      // lastState: BottomSheetBehavior.STATE_COLLAPSED,
      // offset: 0,
      // settlingExpanded: false,
    };
  }

  state: State;

  componentDidMount() {
    this.loadEvents();

    this.lastState = BottomSheetBehavior.STATE_COLLAPSED;
    // this.setState({
    //   lastState: BottomSheetBehavior.STATE_COLLAPSED,
    // });

    // if (this.fab && this.bottomSheet) {
    this.fab.setAnchorId(this.bottomSheet);
    // }
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (prevState.loading && !this.state.loading) {
      this.loadingView.fadeOut(400)
        .then((/* endState*/) => {
          // console.log('loading faded');
        });
    }

    if (!_.isEqual(prevState.date, this.state.date)) {
      const edgePadding: EdgePadding = {
        top: 40,
        right: 40,
        bottom: 40,
        left: 40,
      };
      const coords: Array<LatLng> = getCurrentEvents(this.state.events, this.state.date)
        .map(event => event.latlng);
      // TODO check the delta between events and if less than reasonable amount,
      // use padding to compensate
      // and if only one event, use some other value
      if (!!this.map && coords && coords.length > 1) {
        this.map.fitToCoordinates(coords, edgePadding,
          true,
        );
      }
    }
  }

  // componentDidUpdate(prevProps: Props, prevState: State) {
    // if (prevState.events !== this.state.events) {
    //
    // }
    // const edgePadding: EdgePadding = {
    //   top: 40,
    //   right: 40,
    //   bottom: 40,
    //   left: 40,
    // };
    // const coords: Array<LatLng> = getCurrentEvents(this.state.events, this.state.date)
    //   .map(event => event.latlng);
    // TODO check the delta between events and if less than reasonable amount,
    // use padding to compensate
    // and if only one event, use some other value
    // if (!!this.map && coords && coords.length > 1) {
    //   this.map.fitToCoordinates(coords, edgePadding,
    //     true,
    //   );
    // }
  // }

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

  handleBottomSheetOnPress = (/* e: Object*/) => {
    // console.log('bottom sheet pressed');
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
    // console.log('handle bottom sheet change', newState);

    if (this.offset > 0.1 &&
      newState === BottomSheetBehavior.STATE_DRAGGING ||
      newState === BottomSheetBehavior.STATE_EXPANDED) {
      this.setState({ bottomSheetColor: 1 });
    }
    if (newState === BottomSheetBehavior.STATE_SETTLING && !this.settlingExpanded) {
      this.setState({ bottomSheetColor: 0 });
    }

    // this.setState({ lastState: newState });
    this.lastState = newState;
  }

  handleSlide = (e: Object) => {
    const { bottomSheetColor } = this.state;
    const offset = parseFloat(e.nativeEvent.offset.toFixed(2));

    this.settlingExpanded = offset >= this.offset;
    this.offset = offset;

    // let bottomSheetColor = 0;
    // console.log('handle slide', offset);

    if (offset === 0) {
      // bottomSheetColor = 0;
      this.setState({ bottomSheetColor: 0 });
    } else if (bottomSheetColor !== 1 &&
      this.lastState === BottomSheetBehavior.STATE_DRAGGING) {
      this.setState({ bottomSheetColor: 1 });
      // bottomSheetColor = 1;
    }

    // this.setState({
    //   bottomSheetColor,
    //   settlingExpanded: offset >= this.state.offset,
    //   offset,
    // });
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

  // onRegionChange = (region: Object) => {
    // console.log('on region change');
    // if (ANDROID) this.state.region.setValue(region);
  // }

  setDate = (value: number) => {
    // console.log('set date');
    if (value !== this.state.date) {
      this.setState({ date: value, activeEvent: null });
    }
  };

  markerPressed = (marker: MapMarker) => {
    // console.log('marker pressed');
    const event: ?Event = this.state.events
      .filter(e => e.id === marker.id)[0];
    // if (!event) { return; }
    this.setState({ activeEvent: event });
  }

  // setMarkers = (markers: Array<Marker>): void => {
  //   this.setState({ markers });
  // };

  renderLoading = () => (
    <Animatable.View style={styles.loading} pointerEvents="none" ref={view => { this.loadingView = view; }}>
      <Spinner
        type="9CubeGrid"
        size={60}
        color="#fff"
      />
      <Animatable.Text animation="pulse" easing="ease-out" iterationCount="infinite" style={{ color: '#fff', fontSize: 16, textAlign: 'center' }}>
        Looking up events nearby...
      </Animatable.Text>
    </Animatable.View>
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
      <View style={styles.mapContainer}>
        <MapView
          ref={ref => { this.map = ref; }}
          style={styles.mapView}
          // region={region}
          // cacheEnabled={true}
          onPress={() => this.setState({ activeEvent: null })}
          initialRegion={REGION}
          // showsScale={true}
          loadingEnabled={false}
          showsUserLocation={true}
          // showsMyLocationButton={true}
          // provider="google"
          // onRegionChange={this.onRegionChange}
        >
          {currentMarkers.map((marker) => (
            <Marker
              {...marker}
              key={`marker-${marker.id}`}
              type={marker.type}
              onPress={() => this.markerPressed(marker)}
            />
          ))}
        </MapView>
      </View>
    );
  };

  renderDetailItem = (icon: string, text: string, callback: any = () => {}) => (
    <TouchableNativeFeedback onPress={callback} delayPressIn={0} delayPressOut={0} background={rippleColor('#d1d1d1')}>
      <View>
        <View pointerEvents="none" style={styles.detailItem}>
          <Icon name={icon} size={18} color={PRIMARY_COLOR} />
          <Text pointerEvents="none" style={styles.detailText}>{text}</Text>
        </View>
      </View>
    </TouchableNativeFeedback>
  );

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
    // const starsAnimated = {
    //   color: bottomSheetColorAnimated.interpolate({
    //     inputRange: [0, 1],
    //     outputRange: [SECONDARY_COLOR, WHITE],
    //   }),
    // };
    // const routeTextAnimated = {
    //   color: bottomSheetColorAnimated.interpolate({
    //     inputRange: [0, 1],
    //     outputRange: [PRIMARY_COLOR, WHITE],
    //   }),
    // };

    const { activeEvent } = this.state;
    // const offsetY = activeEvent ? 0 : -90;

    const inactive = {
      // transform: [{ translateY: -offsetY }]
      // marginTop: offsetY,
      // zIndex: -1,
      style: {
        opacity: 0,
      },
      props: {
        elevation: 0,
      },
    };
    const active = {
      // transform: [{ translateY: -offsetY }]
      // marginTop: 0,
      // zIndex: 5,
      style: {
        opacity: 1,
      },
      props: {
        elevation: 16,
      },
    };

    const title = activeEvent ? activeEvent.title : '';
    const description = activeEvent ? activeEvent.description : '';

    return (
      <BottomSheetBehavior
        ref={bs => { this.bottomSheet = bs; }}
        // ref="bottomSheet"
        elevation={16}
        onSlide={this.handleSlide}
        onStateChange={this.handleBottomSheetChange}
        peekHeight={76}
        {...activeEvent ? active.props : inactive.props}
      >
        <View style={[styles.bottomSheet, activeEvent ? active.style : inactive.style]}>
          <TouchableWithoutFeedback
            onPress={this.handleBottomSheetOnPress}
          >
            <Animated.View style={[styles.bottomSheetHeader, headerAnimated]}>
              <View style={styles.bottomSheetLeft}>
                <Animated.Text numberOfLines={2} style={[styles.bottomSheetTitle, textAnimated]}>
                  {title}
                </Animated.Text>
                {/* <View style={styles.starsContainer}>
                  <Animated.Text style={[starsAnimated, { marginRight: 8 }]}>5.0</Animated.Text>
                  <AnimatedIcon name="md-star" size={16} style={[styles.star, starsAnimated]} />
                  <AnimatedIcon name="md-star" size={16} style={[styles.star, starsAnimated]} />
                  <AnimatedIcon name="md-star" size={16} style={[styles.star, starsAnimated]} />
                  <AnimatedIcon name="md-star" size={16} style={[styles.star, starsAnimated]} />
                  <AnimatedIcon name="md-star" size={16} style={[styles.star, starsAnimated]} />
                </View> */}
              </View>
              {/* <View style={styles.bottomSheetRight}>
                <Animated.Text style={[styles.routeLabel, routeTextAnimated]}>Route</Animated.Text>
              </View> */}
            </Animated.View>
          </TouchableWithoutFeedback>
          <View style={styles.bottomSheetContent}>
            <NestedScrollView style={{ width }}>
              <View style={styles.sectionIcons}>
                {/* <View style={styles.iconBox}>
                  <Icon name="md-call" size={22} color={PRIMARY_COLOR} />
                  <Text style={styles.iconLabel}>CALL</Text>
                </View>
                <View style={styles.iconBox}>
                  <Icon name="md-star" size={22} color={PRIMARY_COLOR} />
                  <Text style={styles.iconLabel}>SAVE</Text>
                </View>
                <View style={styles.iconBox}>
                  <Icon name="md-globe" size={22} color={PRIMARY_COLOR} />
                  <Text style={styles.iconLabel}>WEBSITE</Text>
                </View> */}
              </View>
              {!!activeEvent &&
              <View style={styles.detailListSection}>
                <Text style={styles.poweredBy}>Powered by VisitTampere</Text>
                <View
                  style={{
                    alignItems: 'center',
                    flexDirection: 'row',
                    paddingHorizontal: 22,
                    paddingTop: 15,
                  }}
                >
                  <Text style={{ color: TEXT_BASE_COLOR }}>{description}</Text>
                </View>
                <View
                  style={{
                    alignItems: 'center',
                    flexDirection: 'row',
                    paddingHorizontal: 22,
                    paddingVertical: 22,
                  }}
                >
                  <Image source={activeEvent.image} resizeMode="contain" style={{ width: width - 32, height: 160 }} />
                </View>
                <View
                  style={{
                    alignItems: 'center',
                    flexDirection: 'row',
                    paddingHorizontal: 22,
                    marginVertical: 4,
                  }}
                >
                  <Icon name="md-pricetags" size={18} color={PRIMARY_COLOR} style={{ marginRight: 18 }} />
                  {activeEvent.tags.map(tag => (
                    <View key={`tag-${tag}`} style={{ backgroundColor: this.getTagColor(tag), borderRadius: 10, marginLeft: 4, paddingVertical: 5, paddingHorizontal: 8 }}>
                      <Text style={{ color: '#f5f5f5', textAlign: 'center', fontFamily: 'sans-serif', fontSize: 12 }}>{tag}</Text>
                    </View>
                  ))}
                </View>
                {!!activeEvent.contactInfo.address && this.renderDetailItem('md-locate', activeEvent.contactInfo.address, this.handleOpenNavigation)}
                {this.renderDetailItem('md-timer', `${moment(activeEvent.start).format('LT')} - ${moment(activeEvent.end).format('LT')}`)}
                {!!activeEvent.contactInfo.email && this.renderDetailItem('md-mail', activeEvent.contactInfo.email)}
                {this.renderDetailItem('logo-euro', activeEvent.free ? 'Free' : 'Non-Free')}
                {!!activeEvent.contactInfo.link && this.renderDetailItem('md-globe', activeEvent.contactInfo.link, this.handleOpenUrl)}
                {/* {this.renderDetailItem('md-create', 'Suggest an edit')} */}
                </View>}
            </NestedScrollView>
          </View>
        </View>
      </BottomSheetBehavior>
    );
  }

  getTagColor = (tag: string) => {
    type TagColor = {tag: string; color: string};
    const tagColors: Array<TagColor> = [
      { tag: 'other-event',
        color: '#7AA9FF' },
      { tag: 'for-children',
        color: '#017CBD' },
      { tag: 'festival',
        color: '#6C0171' },
      { tag: 'music',
        color: '#F07000' },
      { tag: 'market',
        color: '#81164F' },
      { tag: 'sports',
        color: '#32196B' },
      { tag: 'movie',
        color: '#C50C30' },
      { tag: 'entertainment',
        color: '#FF4AAB' },
      { tag: 'trade-fair',
        color: '#158072' },
      { tag: 'theatre',
        color: '#81164F' },
      { tag: 'dance',
        color: '#4E3C4D' },
      { tag: 'exhibition',
        color: '#F7BF0B' },
    ];
    const defaultColor: string = '#F943F3';

    const correctTag: TagColor = tagColors.filter(tagColor => tagColor.tag === tag)[0];

    return correctTag ? correctTag.color : defaultColor;
  };

  renderFloatingActionButton = () => {
    const { bottomSheetColor } = this.state;
    const isExpanded = bottomSheetColor === 1;
    const { activeEvent } = this.state;
    const inactive = {
      // transform: [{ translateY: -offsetY }]
      // marginTop: offsetY,
      // zIndex: -1,
      style: {
        opacity: 0,
      },
      props: {
        elevation: 0,
      },
    };
    const active = {
      // transform: [{ translateY: -offsetY }]
      // marginTop: 0,
      // zIndex: 5,
      style: {
        opacity: 1,
      },
      props: {
        elevation: 18,
      },
    };

    return (
      <FloatingActionButton
        // ref="fab"
        ref={fab => { this.fab = fab; }}
        elevation={18}
        rippleEffect={true}
        icon="event"
        iconProvider={IconMDI}

        iconColor={!isExpanded ? WHITE : SECONDARY_COLOR}
        onPress={this.handleFabPress}
        backgroundColor={isExpanded ? WHITE : SECONDARY_COLOR}
        {...activeEvent ? active : inactive}
      />
    );
  }

  render() {
    // const loading: boolean = this.state.loading;

    return (
      <CoordinatorLayout style={styles.container}>
        <StatusBar
          backgroundColor={DARK_PRIMARY_COLOR}
          animated={true}
          barStyle="default"
        />
        <NavigationBar
          backgroundColor={PRIMARY_COLOR}
          animated={true}
          // translucent={true}
        />
        <View style={styles.content}>
          {this.renderMap()}
          <Slider
            date={this.state.date}
            onValueChange={this.setDate}
          />
          {/* {!!this.state.activeEvent && <Toolbar event={this.state.activeEvent} />} */}
          {/* {isFetching && this.renderLoading() }
          {error && this.renderError()} */}
        </View>
        {false && this.state.activeEvent &&
          <Animated.View
            style={{
              width,
              bottom: 0,
              position: 'absolute',
              height: 200,
              left: 0,
              right: 0,
              // alignSelf: 'flex-end',
              transform: [{ translateY: -this.offset * 200 }],
            }}
          >
            <Image
              source={this.state.activeEvent.image}
              resizeMode="cover"
              style={{ flex: 1 }}
            />
          </Animated.View>
        }
        {this.renderBottomSheet()}
        {this.renderFloatingActionButton()}
        {this.renderLoading()}
        {}
      </CoordinatorLayout>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  content: {
    backgroundColor: 'transparent',
  },
  mapView: {
    ...StyleSheet.absoluteFillObject,
    // justifyContent: 'flex-end',
    // alignItems: 'center',
  },
  mapContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: height - 24,
    width,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  error: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loading: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: PRIMARY_COLOR,
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
  bottomSheetLeft: {
    flexDirection: 'column',
  },
  // bottomSheetRight: {
  //   flexDirection: 'column',
  // },
  bottomSheetTitle: {
    fontFamily: 'sans-serif-medium',
    fontSize: 18,
  },
  bottomSheetContent: {
    alignItems: 'center',
    height: height * 3 / 5,
    backgroundColor: WHITE,
  },
  // starsContainer: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  // },
  // star: {
  //   marginHorizontal: 2,
  // },
  // routeLabel: {
  //   marginTop: 32,
  //   fontSize: 12,
  //   color: PRIMARY_COLOR,
  // },
  sectionIcons: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: -2,
    paddingLeft: 18,
    paddingRight: 18,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  // iconBox: {
  //   flex: 1,
  //   borderRadius: 50,
  //   alignItems: 'center',
  //   flexDirection: 'column',
  // },
  // iconLabel: {
  //   fontSize: 14,
  //   marginTop: 4,
  //   color: PRIMARY_COLOR,
  // },
  detailListSection: {
    paddingBottom: 12,
  },
  detailItem: {
    height: 50,
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 22,
  },
  detailText: {
    color: '#333',
    fontSize: 12,
    marginLeft: 24,
  },
  poweredBy: {
    borderRadius: 5,
    backgroundColor: '#fff',
    textAlign: 'center',
    paddingTop: 20,
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
