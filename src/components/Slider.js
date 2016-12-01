// @flow
import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
} from 'react-native';
import SliderComponent from 'react-native-slider';
import locale from 'react-native-locale-detector';
import moment from 'moment';


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
  date: number;
  onValueChange: Function;
};

const Slider = (props: Props) => (
  <View style={styles.sliderBox} elevation={4}>
    <View style={styles.sliderBoxInner}>
      <SliderComponent
        style={styles.slider}
        minimumValue={0}
        maximumValue={6}
        onValueChange={props.onValueChange}
        thumbTintColor="#FF3F80"
        minimumTrackTintColor="rgba(0, 0, 0, 0.47)"
        maximumTrackTintColor="rgba(0, 0, 0, 0.47)"
        step={1}
        value={props.date}
      />
      <View style={styles.datesContainer}>
        {[0, 1, 2, 3, 4, 5, 6].map(val => (
          <View key={`date-${val}`}>
            <Text
              style={{
                color: props.date === val ? '#000' : '#454545',
                fontWeight: props.date === val ? 'bold' : 'normal',
              }}
            >
              {moment().add(val, 'days').startOf('day').format('dd')}
            </Text>
          </View>
        ))}
      </View>
    </View>
  </View>
);


const styles = StyleSheet.create({
  slider: {
  },
  sliderBox: {
    flexDirection: 'row',
    marginHorizontal: 24,
    marginTop: 8,
    borderRadius: 2,
    paddingHorizontal: 20,
    // backgroundColor: 'rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff',
    // flex: 0,
    flexGrow: 0,
    width: Dimensions.get('window').width - 24 * 2,

  },
  sliderBoxInner: {
    flex: 1,
    flexDirection: 'column',
    flexGrow: 1,
  },
  datesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 0,
    paddingBottom: 4,
  },
});

export default Slider;
