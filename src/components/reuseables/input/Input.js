import { Platform, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { memo } from 'react'
import { COLOR, TEXT_STYLE, hp, wp } from '../../../enums/StyleGuide'
import Label from '../label'
import Pressable from '../pressable'
import SvgItem from '../svgItem'
import CustomIcon from '../customIcon'

const Input = ({ secureTextEntry,inputLabel2,inputDisabled,style, iconName, iconSize, inputStyle, placeholder, placeholderTextColor, onChange, value, multiline, keyboard, inputLabel, labelStyle, passwordWarnig,lines,iconFamily,iconPress,disabled }) => {

  return (
    <View style={{ marginVertical: hp(2) }}>
      {inputLabel && <Label style={[styles.inputLabelText, labelStyle]}>{inputLabel} <Label style={styles.inputLable2Style}>{inputLabel2}</Label></Label>}
      <View style={[styles.inputContainer, style]}>
        <TextInput
          style={[styles.input, inputStyle,]}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor || COLOR.grey}
          value={value}
          onChangeText={onChange}
          keyboardType={keyboard}
          multiline={multiline}
          numberOfLines={lines}
          secureTextEntry={secureTextEntry}
          editable={!inputDisabled}
          selectTextOnFocus={!inputDisabled}
        />
        {iconName && <Pressable disabled={disabled} onPress={iconPress} style={styles.iconContainer}><CustomIcon name={iconName} family={iconFamily} size={iconSize} /></Pressable>}
      </View>
      {passwordWarnig && <Label style={styles.passwordWarningText}>{passwordWarnig}</Label>}
    </View>
  )
}

export default memo(Input)

const styles = StyleSheet.create({
  inputContainer: {
    height:Platform.OS === 'android' ? 'auto': hp(5),
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderColor: COLOR.purple,
  },
  input: {
   height:"100%",
    paddingLeft: wp(4),
    flex: 1,
    color:COLOR.black
  },
  iconContainer: {
    marginRight: '2%'
  },
  inputLabelText: {
    ...TEXT_STYLE.textSemiBold,
    color:COLOR.purple
  },
  passwordWarningText: {
    ...TEXT_STYLE.text,
    color: 'red',
    marginTop: hp(0.5)
  },
  inputLable2Style:{
    color:COLOR.red,
    fontSize:18
  }
})
