// @flow
import React from 'react';
import {
  TouchableNativeFeedback,
  StyleSheet,
  Text,
  View,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import {
  PRIMARY_COLOR,
} from '../theme';

type Props = {
  icon: string;
  text: string;
  onPress?: Function;
};

type DefaultProps = {
  text: string;
  onPress: Function;
  icon: string;
};

const defaultProps: DefaultProps = {
  text: '',
  icon: 'error',
  onPress: () => {},
};

const rippleColor = (...args) =>
  Platform.Version >= 21 &&
    TouchableNativeFeedback.Ripple(...args)
    || null;


const DetailItem = ({ icon, text, onPress }: Props = defaultProps) => (
  <TouchableNativeFeedback
    onPress={onPress}
    delayPressIn={0}
    delayPressOut={0}
    background={rippleColor('#d1d1d1')}
  >
    <View pointerEvents="none" style={styles.container}>
      <Icon name={icon} size={18} color={PRIMARY_COLOR} />
      <Text pointerEvents="none" style={styles.text}>{text}</Text>
    </View>
  </TouchableNativeFeedback>
);

const styles = StyleSheet.create({
  container: {
    height: 50,
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 22,
  },
  text: {
    color: '#333',
    fontSize: 12,
    marginLeft: 24,
  },
});

export default DetailItem;
