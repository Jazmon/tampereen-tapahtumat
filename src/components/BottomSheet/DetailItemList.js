// @flow
import React from 'react';
import {
  View,
} from 'react-native';
import moment from 'moment';

import DetailItem from '../DetailItem';

type Props = {
  event: Event;
  openUrl: Function;
  openNavigation: Function;
}

const DetailItemList = ({ event, openUrl, openNavigation }: Props) => (
  <View>
    {!!event.contactInfo.link &&
      <DetailItem icon="md-globe" text={event.contactInfo.link} onPress={openUrl} />
    }
    {!!event.contactInfo.address &&
      <DetailItem icon="md-locate" text={event.contactInfo.address} onPress={openNavigation} />
    }
    <DetailItem icon="md-timer" text={`${moment(event.start).format('LT')} - ${moment(event.end).format('LT')}`} />
    <DetailItem icon="logo-euro" text={event.free ? 'Free' : 'Paid'} />
    {!!event.contactInfo.email &&
      <DetailItem icon="md-mail" text={event.contactInfo.email} />
    }
  </View>
);

export default DetailItemList;
