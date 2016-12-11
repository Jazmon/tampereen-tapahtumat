// @flow
import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import Header from './Header';
import Content from './Content';
import {
  BOTTOM_SHEET_HEADER_HEIGHT,
} from '../../theme';

type Props = {
  activeEvent: ?ApiEvent;
  date: number;
  onPress: Function;
  openNavigation: Function;
  openUrl: Function;
  openTicketUrl: Function;
  bottomSheetColor: number;
  bottomSheetColorAnimated: Object;
};

// eslint-disable-next-line react/prefer-stateless-function
class BottomSheet extends React.Component {
  props: Props;

  render() {
    const {
      activeEvent,
      date,
      onPress,
      bottomSheetColor,
      bottomSheetColorAnimated,
      openUrl,
      openNavigation,
      openTicketUrl,
    } = this.props;

    return (
      <View
        style={[styles.bottomSheet, {
          bottom: activeEvent ? 0 : -BOTTOM_SHEET_HEADER_HEIGHT,
        }]}
      >
        <Header
          onPress={onPress}
          title={activeEvent ? activeEvent.title : ''}
          bottomSheetColorAnimated={bottomSheetColorAnimated}
          bottomSheetColor={bottomSheetColor}
        />
        <Content
          event={activeEvent}
          date={date}
          openUrl={openUrl}
          openNavigation={openNavigation}
          openTicketUrl={openTicketUrl}
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
