// @flow
/* eslint-disable react/prop-types */
import React from 'react';
import {
  View,
  StatusBar,
  StyleSheet,
} from 'react-native';
import NavigationBar from 'react-native-onscreen-navbar';

type Props = {
  children?: ?any;
  systemBarColor?: string;
  barStyle?: 'default' | 'light-content';
  backgroundColor?: string;
  animated?: boolean;
}

const defaultProps = {
  systemBarColor: '#000',
  backgroundColor: '#fff',
  barStyle: 'default',
  animated: true,
};

const Base = (props: Props = defaultProps) => (
  <View style={[styles.container, { backgroundColor: props.backgroundColor }]}>
    <StatusBar
      backgroundColor={props.systemBarColor}
      animated={props.animated}
      barStyle={props.barStyle}
    />
    <NavigationBar
      backgroundColor={props.systemBarColor}
      animated={props.animated}
    />
    <View style={styles.contentWrapper}>
      {props.children}
    </View>
  </View>
);

type Style = {[key: string]: number};

const styles: Style = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
  },
  contentWrapper: {
    flex: 1,
    flexDirection: 'column',
  },
});

export default Base;
