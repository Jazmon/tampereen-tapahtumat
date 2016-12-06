// @flow
import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Platform,
  Animated,
  Text,
  ToastAndroid,
  StatusBar,
  NativeModules,
  Linking,
} from 'react-native';
import i18n from 'i18next';
import MapView from 'react-native-maps';
import moment from 'moment';
import NavigationBar from 'react-native-onscreen-navbar';
import _ from 'lodash';
import {
  CoordinatorLayout,
  BottomSheetBehavior,
} from 'react-native-bottom-sheet-behavior';
import { Lokka } from 'lokka';
import { Transport } from 'lokka-transport-http';

import {
  PRIMARY_COLOR,
  DARK_PRIMARY_COLOR,
} from './theme';

import Marker from './components/Marker';
// import Base from './components/Base';
import Loading from './components/Loading';
import BottomSheet from './components/BottomSheet';
import Slider from './components/Slider';
import FloatingActionButton from './components/FloatingActionButton';

const DURATION = 120;
const client = new Lokka({
  transport: new Transport('https://vast-hollows-14109.herokuapp.com/graphql'),
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
  activeEvent: ?ApiEvent;

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
    this.fab.setAnchor(this.bottomSheet);
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (prevState.loading && !this.state.loading) {
      this.loadingView.hide();
    }

    if (!_.isEqual(prevState.date, this.state.date)) {
      const edgePadding: EdgePadding = {
        top: 40,
        right: 40,
        bottom: 40,
        left: 40,
      };
      const coords: Array<LatLng> = this.state.events
        .filter(event => {
          const length = event.times.length;
          for (let i = 0; i < length; i++) {
            const time = event.times[i];
            const selectedDate = moment().add(this.state.date, 'days').startOf('day');
            const sameDay = selectedDate.isSame(time.start, 'day');
            if (sameDay) {
              return true;
            }
          }
          return false;
        })
        .filter(event => !!event.latitude && !!event.longitude)
        .map(event => ({
          latitude: (event: any).latitude,
          longitude: (event: any).longitude,
        }))
        .filter(latlng => {
          const center: LatLng = {
            latitude: 61.497418,
            longitude: 23.757059,
          };
          const MAX_DELTA_LONGITUDE = 0.2;
          const MAX_DELTA_LATITUDE = 0.2;
          const diff = {
            latitude: center.latitude - latlng.latitude,
            longitude: center.longitude - latlng.longitude,
          };
          const outside =
            Math.abs(diff.longitude) > MAX_DELTA_LONGITUDE ||
             Math.abs(diff.latitude) > MAX_DELTA_LATITUDE;
          return !outside;
        });
      // console.log(coords);
      // const coords: Array<LatLng> = getCurrentEvents(this.state.events, this.state.date)
      //   .map(event => event.latlng);
      // TODO check the delta between events and if less than reasonable amount,
      // use padding to compensate
      // and if only one event, use some other value
      if (!!this.map && coords && coords.length > 1) {
        this.map.fitToCoordinates(coords, { edgePadding,
          animated: true,
        });
      }
    }
  }

  handleFabPress = () => {
    const { activeEvent } = this.state;
    if (activeEvent) {
      Calendar.insertEvent({
        start: activeEvent.times[0].start,
        end: activeEvent.times[0].end,
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

  handleOpenTicketUrl = () => {
    const url: ?string = _.get(this.state, 'activeEvent.ticketLink');
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
          ToastAndroid.show(i18n.t('common:errorOpenNavigation'), ToastAndroid.SHORT);
        }
      });
    } else {
      ToastAndroid.show(i18n.t('common:errorOpenNavigation'), ToastAndroid.SHORT);
    }
  }

  loadEvents = async () => {
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
          start: new Date(time.start),
          end: new Date(time.end),
        })),
      }));
      this.setState({ events, loading: false });
    });
  }

  setDate = (value: number) => {
    if (value !== this.state.date) {
      this.setState({ date: value, activeEvent: null });
    }
  };

  markerPressed = (marker: MapMarker) => {
    const event: ?ApiEvent = this.state.events
      .filter(e => e.id === marker.id)[0];
    this.setState({ activeEvent: event });
  }

  renderError = () => (
    <View style={styles.error}>
      <Text>{i18n.t('common:errorLoadingEvents')}</Text>
    </View>
  );

  renderMap = () => {
    const markers = this.state.events
      .filter(event => {
        const length = event.times.length;
        for (let i = 0; i < length; i++) {
          const time = event.times[i];
          const selectedDate = moment().add(this.state.date, 'days').startOf('day');
          const sameDay = selectedDate.isSame(time.start, 'day');
          if (sameDay) {
            return true;
          }
        }
        return false;
      })
      .filter(event => !!event.latitude && !!event.longitude)
      .map(event => ({
        ...event,
        latlng: {
          latitude: (event: any).latitude,
          longitude: (event: any).longitude,
        },
      }));
    return (
      <View style={styles.mapContainer}>
        <MapView
          ref={ref => { this.map = ref; }}
          style={styles.mapView}
          onPress={() => this.setState({ activeEvent: null })}
          initialRegion={REGION}
          loadingEnabled={false}
          showsUserLocation={true}
          showsMyLocationButton={false}
        >
          {markers.map((marker) =>
            <Marker
              {...marker}
              key={marker.id}
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
      activeEvent,
      date,
    } = this.state;

    Animated.timing(bottomSheetColorAnimated, {
      duration: DURATION,
      toValue: bottomSheetColor,
    }).start();

    return (
      <BottomSheetBehavior
        ref={bs => { this.bottomSheet = bs; }}
        elevation={activeEvent ? 16 : 0}
        onSlide={this.handleSlide}
        onStateChange={this.handleBottomSheetChange}
        peekHeight={80}
      >
        <BottomSheet
          activeEvent={activeEvent}
          date={date}
          openUrl={this.handleOpenUrl}
          openNavigation={this.handleOpenNavigation}
          bottomSheetColorAnimated={bottomSheetColorAnimated}
          bottomSheetColor={bottomSheetColor}
          onPress={this.handleBottomSheetOnPress}
          openTicketUrl={this.handleOpenTicketUrl}
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
        />
        <NavigationBar
          backgroundColor={PRIMARY_COLOR}
          animated={true}
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
          expanded={bottomSheetColor === 1}
        />
        <Loading ref={view => { this.loadingView = view; }} />
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
});

export default App;
