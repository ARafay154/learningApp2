import { StyleSheet, TouchableOpacity } from 'react-native';
import React, { memo } from 'react';
import * as Animatable from 'react-native-animatable';

const AnimatablePressable = Animatable.createAnimatableComponent(TouchableOpacity);

const Pressable = ({ children,hitSlop={ top: 10, bottom: 10, left: 10, right: 10 }, onPress, style, animation,disabled }) => {
  return (
    <AnimatablePressable
      activeOpacity={0.85}
      hitSlop={hitSlop}
      style={style}
      animation={animation} // Add animation prop here
      onPress={() => { onPress && onPress(); }}
      disabled={disabled}
    >
      {children}
    </AnimatablePressable>
  );
};

export default memo(Pressable);

const styles = StyleSheet.create({});
