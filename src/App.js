import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableNativeFeedback,
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
const SPACE = 0.01;

class App extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.requestEvents();
  }

  render() {
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
          {this.props.events.map(event => !!event ? (
            <MapView.Marker
              key={`marker-${event.id}`}
              coordinate={event.latlng}
              title={event.title}
              description={event.description}
            />
          ) : null)}
        </MapView>
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
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

// export default connect(
//   ({ reposByUser }, ownProps) => ({
//     reposByUser,
//     user: ownProps.params.user
//   }),
//   { requestReposByUser }
// )(ReposByUser);
// const mapStateToProps = (state: { events: any }, ownProps) => ({
//   ...state,
// });

export default connect(
  (props, ownProps) => ({
    ...props.events,
    ...ownProps,
  }),
  { requestEvents }
)(App);

// export default connect(mapStateToProps(state,))(App);
