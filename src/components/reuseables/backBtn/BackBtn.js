import { StyleSheet, View, TouchableOpacity } from 'react-native';
import React, { memo } from 'react';
import CustomIcon from '../customIcon';
import { COLOR, hp } from '../../../enums/StyleGuide';
import { useNavigation } from '@react-navigation/native';

const BackBtn = ({  }) => {
  const navigation = useNavigation()
  return (
    <TouchableOpacity onPress={()=>navigation.goBack()} style={styles.container}>
      <CustomIcon name="arrow-back" family='MaterialIcons' size={hp(4)} color={COLOR.purple} />
    </TouchableOpacity>
  );
};

export default memo(BackBtn);

const styles = StyleSheet.create({
  
});
