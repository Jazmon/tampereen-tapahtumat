// @flow
import React from 'react';
import * as Animatable from 'react-native-animatable';
import Spinner from 'react-native-spinkit';
import {
  StyleSheet,
} from 'react-native';
import i18n from 'i18next';

import {
  PRIMARY_COLOR,
} from '../theme';

type State = { shouldRender: boolean; };

class Loading extends React.Component {
  loadingView: Object;

  state: State = {
    shouldRender: true,
  };


  hide = () => {
    this.loadingView.fadeOut(400)
      .then(() => {
        this.setState({ shouldRender: false });
      });
  }

  render() {
    const { shouldRender } = this.state;
    if (!shouldRender) {
      return null;
    }
    return (
      <Animatable.View
        style={styles.loading}
        pointerEvents="none"
        useNativeDriver
        ref={view => { this.loadingView = view; }}
      >
        <Spinner
          type="9CubeGrid"
          size={60}
          color="#fff"
        />
        <Animatable.Text
          animation="pulse"
          easing="ease-out"
          useNativeDriver
          direction="alternate"
          iterationCount="infinite"
          style={{ color: '#fff', fontSize: 16, textAlign: 'center' }}
        >
          {i18n.t('common:loading')}
        </Animatable.Text>
      </Animatable.View>
    );
  }
}

type Style = {[key: string]: number};
const styles: Style = StyleSheet.create({
  loading: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: PRIMARY_COLOR,
  },
});

export default Loading;
