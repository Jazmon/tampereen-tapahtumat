// @flow
import React from 'react';
import {
  View,
  Text,
  TouchableHighlight,
  Animated,
  Dimensions,
  PanResponder,
  StyleSheet,
} from 'react-native';

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

type Props = {
  event: Event;
};

type State = {
  expanded: boolean;
  animation: Object;
  pan: Object;
};

class Toolbar extends React.Component {
  props: Props;

  constructor(props: Props) {
    super(props);

    this.state = {
      expanded: false,
      animation: new Animated.Value(0),
      pan: new Animated.ValueXY(),
    };
  }

  state: State;

  componentWillMount() {
    (this: any).panResponder = PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

      onPanResponderGrant: (evt, gestureState) => {
        // The guesture has started. Show visual feedback so the user knows
        // what is happening!

        // gestureState.{x,y}0 will be set to zero now
      },
      onPanResponderMove:
        Animated.event([
          null,                // raw event arg ignored
          { dx: this.state.pan.x,
            dy: this.state.pan.y,
          },    // gestureState arg
        ]),
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        console.log('released');
        // The user has released all touches while this view is the
        // responder. This typically means a gesture has succeeded
      },
      onPanResponderTerminate: (evt, gestureState) => {
        console.log('terminated');
        // Another component has become the responder, so this gesture
        // should be cancelled
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        console.log('should block native responder');
        // Returns whether this component should block native components from becoming the JS
        // responder. Returns true by default. Is currently only supported on android.
        return true;
      },
    });
  }

  toggle = () => {
    // const minHeight = 48;
    // const maxHeight = windowHeight;
    // const initialValue = this.state.expanded ? maxHeight : minHeight;
    const finalValue = this.state.expanded ? 0 : 1;
    // const finalValue = this.state.expanded ? minHeight : maxHeight;
    const bool = !this.state.expanded;
    this.setState({
      expanded: bool,
    });

    // this.state.animation.setValue(initialValue);
    Animated.spring(
      this.state.animation,
      {
        toValue: finalValue,
      }
    ).start();
  }

  render() {
    // const toolbarHeight = this.state.expanded ? windowHeight - 24 : 48;
    const event = this.props.event;
    // const height = this.state.animation.interpolate({
    //   inputRange: [0, 1],
    //   outputRange: [48, windowHeight],
    // });
    // const height = this.state.pan.x.getTranslate

    const transform = [{ translateY: this.state.pan.y }];

    return (
      <Animated.View
        style={[styles.toolbar, { transform }]}
        {...(this: any).panResponder.panHandlers}
      >
        <View style={{ }}>
          <Text>{event.title}</Text>
        </View>
        {this.state.expanded &&
          <View>
            <Text>{event.description}</Text>
          </View>
        }
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  toolbar: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: Dimensions.get('window').width,
    height: 48,
    backgroundColor: '#fff',
    // justifyContent: 'center',
    // alignItems: 'center',
  },
});

export default Toolbar;
