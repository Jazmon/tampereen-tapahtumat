// @flow
import React from 'react';
import {
  View,
  StyleSheet,
  Text,
} from 'react-native';

const getTagColor = (tag: string) => {
  type TagColor = {tag: string; color: string};
  const tagColors: Array<TagColor> = [
    { tag: 'other-event',
      color: '#7AA9FF' },
    { tag: 'for-children',
      color: '#017CBD' },
    { tag: 'festival',
      color: '#6C0171' },
    { tag: 'music',
      color: '#F07000' },
    { tag: 'market',
      color: '#81164F' },
    { tag: 'sports',
      color: '#32196B' },
    { tag: 'movie',
      color: '#C50C30' },
    { tag: 'entertainment',
      color: '#FF4AAB' },
    { tag: 'trade-fair',
      color: '#158072' },
    { tag: 'theatre',
      color: '#81164F' },
    { tag: 'dance',
      color: '#4E3C4D' },
    { tag: 'exhibition',
      color: '#F7BF0B' },
  ];
  const defaultColor: string = '#F943F3';

  const correctTag: TagColor = tagColors.filter(tagColor => tagColor.tag === tag)[0];

  return correctTag ? correctTag.color : defaultColor;
};

type Props = {
  tag: string;
};

const Tag = ({ tag }: Props) => (
  <View style={[styles.container, { backgroundColor: getTagColor(tag) }]}>
    <Text style={{ color: '#f5f5f5', textAlign: 'center', fontFamily: 'sans-serif', fontSize: 12 }}>{tag}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    marginLeft: 4,
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
});

export default Tag;
