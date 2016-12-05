// @flow
import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import Header from './Header';
import Content from './Content';

type Props = {
  activeEvent: ?ApiEvent;
  onPress: Function;
  openNavigation: Function;
  openUrl: Function;
  bottomSheetColor: number;
  bottomSheetColorAnimated: Object;
};

// eslint-disable-next-line react/prefer-stateless-function
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

    if (!activeEvent) {
      return null;
    }
    return (
      <View style={styles.bottomSheet}>
        <Header
          onPress={onPress}
          title={activeEvent.title}
          bottomSheetColorAnimated={bottomSheetColorAnimated}
          bottomSheetColor={bottomSheetColor}
        />
        <Content
          event={activeEvent}
          openUrl={openUrl}
          openNavigation={openNavigation}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  bottomSheet: {
    zIndex: 5,
    backgroundColor: 'transparent',
  },
});

export default BottomSheet;
