import { StyleSheet, Text, View } from 'react-native'
import React, { memo } from 'react'
import { Label } from '../reuseables'
import { COLOR, hp, TEXT_STYLE } from '../../enums/StyleGuide'

const EmptyContainer = ({style,text, textStyle}) => {
  return (
    <View style={[styles.container,style]}>
     <Label style={[styles.text,textStyle]}>{text}</Label>
    </View>
  )
}

export default memo(EmptyContainer)

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center',
        justifyContent:'center'
    },
    text:{
        ...TEXT_STYLE.textSemiBold,
        marginVertical:hp(10),
        color:COLOR.purple
    }
})