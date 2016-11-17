// @flow
import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import Header from './Header';
import Content from './Content';

type Props = {
  activeEvent: ?Event;
  onPress: Function;
  openNavigation: Function;
  openUrl: Function;
  bottomSheetColor: number;
  bottomSheetColorAnimated: Object;
};

class BottomSheet extends React.Component {
  props: Props;

  render() {
    const {
      activeEvent,
      onPress,
      bottomSheetColor,
      bottomSheetColorAnimated,
      openUrl,
      openNavigation,
    } = this.props;
    return (
      <View style={[styles.bottomSheet, activeEvent ? active.style : inactive.style]}>
        <Header
          onPress={onPress}
          title={activeEvent ? activeEvent.title : ''}
          bottomSheetColorAnimated={bottomSheetColorAnimated}
          bottomSheetColor={bottomSheetColor}
        />
        {activeEvent &&
          <Content
            event={activeEvent}
            openUrl={openUrl}
            openNavigation={openNavigation}
          />
        }
      </View>
    );
  }
}

const inactive = {
  style: {
    opacity: 0,
  },
};
const active = {
  style: {
    opacity: 1,
  },
};

const styles = StyleSheet.create({
  bottomSheet: {
    zIndex: 5,
    backgroundColor: 'transparent',
  },
});

export default BottomSheet;
