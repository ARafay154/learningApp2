import React, { memo } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Label } from '../reuseables';
import { COLOR, hp, TEXT_STYLE, wp } from '../../enums/StyleGuide';

const RadioBtn = ({ 
  options = [], 
  selectedValue, 
  onSelect, 
  title = 'Select Option', 
  style 
}) => {

  const handleOptionSelect = (option) => {
    onSelect(option);
  };

  return (
    <View style={[styles.container, style]}>
      <Label style={styles.label}>{title}</Label>
      
      <View style={styles.optionsContainer}>
        {options.map((option) => (
          <Pressable 
            key={option} 
            style={styles.option} 
            onPress={() => handleOptionSelect(option)}
          >
            <View style={styles.checkbox}>
              {selectedValue === option && <View style={styles.checked} />}
            </View>
            <Label style={styles.text}>{option}</Label>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

export default memo(RadioBtn);

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    paddingVertical: hp(1),
  },
  
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(1), 
    marginVertical: hp(0.5), 
  },

  checkbox: {
    width: wp(5),
    height: wp(5), 
    borderRadius: hp(4), 
    borderWidth: 1,
    borderColor: COLOR.black,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp(2),
  },
  
  checked: {
    width: wp(3.5),
    height: wp(3.5),
    borderRadius: hp(4), 
    backgroundColor: COLOR.purple,
  },

  optionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around', 
  },

  text: {
    marginLeft: wp(1),
    color: COLOR.black, 
    ...TEXT_STYLE.smallTextRegular, 
  },

  label: {
    ...TEXT_STYLE.textSemiBold,
    color:COLOR.purple
  },
});
