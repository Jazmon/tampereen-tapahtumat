// @flow
import React from 'react';
import {
  View,
} from 'react-native';
import moment from 'moment';
import i18n from 'i18next';

import DetailItem from '../DetailItem';

type Props = {
  event: ApiEvent;
  date: number;
  openUrl: Function;
  openNavigation: Function;
  openTicketUrl: Function;
}

const getPriceText = (event: ApiEvent) => {
  if (event.ticketLink) {
    return i18n.t('common:ticket');
  } else if (!event.free) {
    return i18n.t('common:paid');
  }
  return i18n.t('common:free');
};

const getTimesString = (event: ApiEvent, date: number) => {
  const today = moment().add(date, 'days').startOf('day');
  if (event.times.length === 1) {
    return `${moment(event.times[0].start).format('LT')} - ${moment(event.times[0].end).format('LT')}`;
  }
  const times = event.times
    .filter(time => today.isSame(time.start, 'day'))
    .reduce((acc, curVal, i) => `${acc}${i > 0 ? ', ' : ''}${moment(curVal.start).format('LT')} - ${moment(curVal.end).format('LT')}`, '');
  return times;
  // `${moment(event.times[0].start).format('LT')} - ${moment(event.times[0].end).format('LT')}`
};

const DetailItemList = ({ event, date, openUrl, openNavigation, openTicketUrl }: Props) => (
  <View>
    {!!event.contactInfo.link &&
      <DetailItem icon="md-globe" text={i18n.t('common:website')} onPress={openUrl} />
    }
    {!!event.contactInfo.address &&
      <DetailItem icon="md-locate" text={event.contactInfo.address} onPress={openNavigation} />
    }
    <DetailItem icon="md-timer" text={getTimesString(event, date)} />
    <DetailItem icon="logo-euro" text={getPriceText(event)} onPress={openTicketUrl} />
    {!!event.contactInfo.email &&
      <DetailItem icon="md-mail" text={event.contactInfo.email} />
    }
  </View>
);

export default DetailItemList;
