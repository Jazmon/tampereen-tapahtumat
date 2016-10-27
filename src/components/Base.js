// @flow
import React from 'react';
import {
  View,
  StatusBar,
  StyleSheet,
} from 'react-native';

type Props = {
  children?: Array<React$Element<*>> | React.Element<*>;
};

const Base = ({ children }: Props) => (
  <View style={styles.container}>
    <StatusBar
      backgroundColor="rgb(189, 36, 109)"
      barStyle="default"
      animated={true}
    />
    <View style={styles.container}>
      {children}
    </View>
    {/* TODO: Maybe add on screen navbar styling here */}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#b5b5b5',
  },
});

export default Base;
