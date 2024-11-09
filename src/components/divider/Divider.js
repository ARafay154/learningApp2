import { StyleSheet, Text, View } from 'react-native';
import React, { memo } from 'react';

import { Label } from '../reuseables';
import { COLOR, hp, TEXT_STYLE } from '../../enums/StyleGuide';

const Divider = ({ text,style }) => {
  return (
    <View style={[styles.container,style]}>
      <View style={styles.line} />
      <Label style={styles.text}>{text}</Label>
      <View style={styles.line} />
    </View>
  );
};

export default memo(Divider);

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: hp(2),
  },
  line: {
    flex: 1,
    height: 0.35,
    backgroundColor: COLOR.grey, // Grey line color
  },
  text: {
    marginHorizontal: 10,
    color: COLOR.purple,
    ...TEXT_STYLE.textBold,
  },
});
