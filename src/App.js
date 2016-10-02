import React from 'react';
import { connect } from 'react-redux';
import {
  View,
  Text,
  StyleSheet,
  TouchableNativeFeedback,
} from 'react-native';
import 'rxjs';

import {
  requestEvents,
} from './actions';

const App = (props) => (
  <View style={styles.container}>
    <TouchableNativeFeedback
      onPress={props.requestEvents}
      background={TouchableNativeFeedback.SelectableBackground()}
    >
      <View>
        <Text>Click me!</Text>
      </View>
    </TouchableNativeFeedback>
    <Text style={styles.welcome}>
      Welcome to React Native!
    </Text>
    <Text style={styles.instructions}>
      To get started, edit index.android.js
    </Text>
    <Text style={styles.instructions}>
      Double tap R on your keyboard to reload,{'\n'}
      Shake or press menu button for dev menu
    </Text>
  </View>
);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
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
