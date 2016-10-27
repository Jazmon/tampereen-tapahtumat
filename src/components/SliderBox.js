// @flow
import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
} from 'react-native';
import Slider from 'react-native-slider';
import moment from 'moment';
import locale from 'react-native-locale-detector';
import _ from 'lodash';

// This loads moment locales for the language based on the locale.
// Yes, it's ugly but it's the only way :(
/* eslint-disable global-require */
if (locale.startsWith('fi')) {
  require('moment/locale/fi');
} else if (locale.startsWith('se')) {
  require('moment/locale/se');
}
/* eslint-enable global-require */

type Props = {
  onValueChange: Function;
  value: number;
};

type State = {
  value: number;
};

class SliderBox extends Component {
  constructor(props: Props) {
    super(props);

    this.state = {
      value: props.value,
    };
  }

  state: State;

  valueChanged = (value: number) => {
    if (value !== this.state.value) {
      this.props.onValueChange(value);
      this.setState({ value });
    }
  }

  render() {
    const { value } = this.props;
    return (
      <View style={styles.container}>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={6}
          onValueChange={this.valueChanged}
          thumbTintColor="#304FFE"
          minimumTrackTintColor="rgba(0, 0, 0, 0.47)"
          maximumTrackTintColor="rgba(0, 0, 0, 0.47)"
          step={1}
          value={value}
        />
        <View style={styles.valuesContainer}>
          {_.range(7).map(val => (
            <View key={`asd-${val}`}>
              <Text
                style={{
                  color: value === val ? '#fff' : '#000',
                }}
              >{moment().add(val, 'days').startOf('day').format('dd')}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  slider: {
  },
  container: {
    marginHorizontal: 24,
    marginTop: 8,
    borderRadius: 2,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    flex: 0,
  },
  valuesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 6,
  },
});

export default SliderBox;
