import { StyleSheet, Text } from 'react-native';
import React, { memo } from 'react';
import { COLOR, TEXT_STYLE } from '../../../enums/StyleGuide';
import * as Animatable from 'react-native-animatable';

const AnimatableLabel = Animatable.createAnimatableComponent(Text);

const Label = ({ children, style, color = COLOR.black, animation,...rest }) => {
  return (
    <AnimatableLabel
      allowFontScaling={false}
      animation={animation} 
      style={[styles.textStyle, { color }, style]}
      {...rest}
    >
      {children}
    </AnimatableLabel>
  );
};

export default memo(Label);

const styles = StyleSheet.create({
  textStyle: {
    ...TEXT_STYLE.text,
  },
});
