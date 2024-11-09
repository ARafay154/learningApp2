import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Foundation from 'react-native-vector-icons/Foundation';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import { COLOR, hp } from '../../../enums/StyleGuide';


const CustomIcon = ({ family = 'FontAwesome', name, size = hp(6), color = COLOR.purple, style }) => {
  let IconComponent;

  // Choose the correct icon family based on the `family` prop
  switch (family) {
    case 'FontAwesome':
      IconComponent = FontAwesome;
      break;
    case 'FontAwesome6':
      IconComponent = FontAwesome6;
      break;
    case 'MaterialIcons':
      IconComponent = MaterialIcons;
      break;
    case 'Ionicons':
      IconComponent = Ionicons;
      break;
    case 'Foundation':
      IconComponent = Foundation;
      break;
    case 'Feather':
      IconComponent = Feather;
      break;
    case 'MaterialCommunityIcons':
      IconComponent = MaterialCommunityIcons;
      break;
    case 'SimpleLineIcons':
      IconComponent = SimpleLineIcons;
      break;
    case 'Octicons':
      IconComponent = Octicons;
      break;
    case 'AntDesign':
      IconComponent = AntDesign;
      break;
    case 'Entypo':
      IconComponent = Entypo;
      break;
    // Add more families if needed
    default:
      IconComponent = FontAwesome; // Default to FontAwesome if no family is provided
  }

  return (
    <View style={[styles.iconContainer, style]}>
      <IconComponent name={name} size={size} color={color} />
    </View>
  );
};

export default memo(CustomIcon);

const styles = StyleSheet.create({
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
