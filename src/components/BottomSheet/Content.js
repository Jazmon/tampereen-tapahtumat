// @flow
import React from 'react';
import {
  View,
  Dimensions,
  Text,
  Image,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import {
  NestedScrollView,
} from 'react-native-bottom-sheet-behavior';

import Tag from '../Tag';
import DetailItemList from './DetailItemList';

import {
  PRIMARY_COLOR,
  TEXT_BASE_COLOR,
  WHITE,
} from '../../theme';

type Props = {
  event: ApiEvent;
  date: number;
  openUrl: Function;
  openNavigation: Function;
  openTicketUrl: Function;
};

const { width, height } = Dimensions.get('window');

const Content = ({ event, date, openUrl, openNavigation, openTicketUrl }: Props) => (
  <View style={styles.bottomSheetContent}>
    <NestedScrollView style={{ width }}>
      {!!event &&
        <View style={styles.detailListSection}>
          <Text style={styles.poweredBy}>Powered by VisitTampere</Text>
          <View style={styles.descriptionContainer}>
            <Text style={{ color: TEXT_BASE_COLOR }}>{event.description}</Text>
          </View>
          <View style={styles.imageContainer}>
            <Image source={event.image} resizeMode="contain" style={{ width: width - 32, height: 160 }} />
          </View>
          {/* <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              paddingHorizontal: 22,
              marginVertical: 4,
            }}
          >
            <Icon name="md-pricetags" size={18} color={PRIMARY_COLOR} style={{ marginRight: 18 }} />
            <Tag tag={event.type} />
          </View> */}
          <DetailItemList
            event={event}
            date={date}
            openUrl={openUrl}
            openNavigation={openNavigation}
            openTicketUrl={openTicketUrl}
          />
        </View>
      }
    </NestedScrollView>
  </View>
);

const styles = StyleSheet.create({
  bottomSheetContent: {
    alignItems: 'center',
    height: height * 3 / 5,
    backgroundColor: WHITE,
  },
  detailListSection: {
    paddingBottom: 12,
  },
  poweredBy: {
    borderRadius: 5,
    backgroundColor: '#fff',
    textAlign: 'center',
    paddingTop: 20,
  },
  descriptionContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 22,
    paddingTop: 15,
  },
  imageContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 22,
    paddingVertical: 22,
  },
});

export default Content;
