import { StyleSheet } from 'react-native';
import React, { memo } from 'react';
import Pressable from '../pressable';
import CustomIcon from '../customIcon';

const OpenDrawer = ({setOpen}) => {
 
  return (
    <Pressable onPress={() => setOpen(true)}> 
      <CustomIcon name={"menu"} family='Entypo' />
    </Pressable>
  );
};

export default memo(OpenDrawer);

const styles = StyleSheet.create({});
