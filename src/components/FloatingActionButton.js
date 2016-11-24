// @flow
import React from 'react';
// import {
//   StyleSheet,
// } from 'react-native';
import {
  // NestedScrollView,
  // CoordinatorLayout,
  // BottomSheetBehavior,
  FloatingActionButton as FAB,
} from 'react-native-bottom-sheet-behavior';
// import Icon from 'react-native-vector-icons/Ionicons';
import IconMDI from 'react-native-vector-icons/MaterialIcons';
import {
  WHITE,
  // PRIMARY_COLOR,
  // DARK_PRIMARY_COLOR,
  // LIGHT_PRIMARY_COLOR,
  // TEXT_BASE_COLOR,
  // SECONDARY_TEXT_COLOR,
  SECONDARY_COLOR,
} from '../theme';

// type State = {
//
// };

type Props = {
  // color: string;
  expanded: boolean;
  onPress: Function;
  active: boolean;
};

class FloatingActionButton extends React.Component {
  props: Props;
  fab: Object;

  setAnchor(component: React$Element<*> | React$Component<*, *, *>) {
    this.fab.setAnchorId(component);
  }

  render() {
    const { expanded, active, onPress } = this.props;
    return (
      <FAB
        ref={fab => { this.fab = fab; }}
        elevation={18}
        rippleEffect={true}
        icon="event"
        iconProvider={IconMDI}
        iconColor={!expanded ? WHITE : SECONDARY_COLOR}
        onPress={onPress}
        backgroundColor={expanded ? WHITE : SECONDARY_COLOR}
        {...active ? activeProps : inactiveProps}
      />
    );
  }
}

const inactiveProps = {
  style: {
    opacity: 0,
  },
  props: {
    elevation: 0,
  },
};
const activeProps = {
  style: {
    opacity: 1,
  },
  props: {
    elevation: 18,
  },
};

// const styles = StyleSheet.create({
//   activeStyle: {
//
//   },
//   inactiveStyle: {
//
//   }
// });

export default FloatingActionButton;
