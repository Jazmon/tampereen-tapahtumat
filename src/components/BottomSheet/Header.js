// @flow
import React from 'react';
import {
  View,
  TouchableWithoutFeedback,
  Animated,
  StyleSheet,
} from 'react-native';

import {
  PRIMARY_COLOR,
  WHITE,
  TEXT_BASE_COLOR,
} from '../../theme';

type Props = {
  title: string;
  bottomSheetColorAnimated: Object;
  bottomSheetColor: number;
  onPress: Function;
}
const DURATION = 120;

class Header extends React.Component {
  props: Props;

  render() {
    const { bottomSheetColorAnimated, bottomSheetColor, title, onPress } = this.props;
    Animated.timing(bottomSheetColorAnimated, {
      duration: DURATION,
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
    return (
      <TouchableWithoutFeedback onPress={onPress}>
        <Animated.View style={[styles.bottomSheetHeader, headerAnimated]}>
          <View style={styles.bottomSheetLeft}>
            <Animated.Text numberOfLines={2} style={[styles.bottomSheetTitle, textAnimated]}>
              {title}
            </Animated.Text>
          </View>
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  bottomSheetHeader: {
    padding: 24,
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bottomSheetLeft: {
    flexDirection: 'column',
  },
  bottomSheetTitle: {
    fontFamily: 'sans-serif-medium',
    fontSize: 18,
  },
});

export default Header;
