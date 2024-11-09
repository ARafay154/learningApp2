import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React, { memo } from 'react'
import { COLOR, hp } from '../../../enums/StyleGuide'

const Loader = ({ size = 'large', color = COLOR.purple,style }) => {
    return (
        <View style={[styles.container,style]}>
            <ActivityIndicator size={size} color={color} />
        </View>
    )
}

export default memo(Loader)

const styles = StyleSheet.create({
    container:{
        marginVertical:hp(10)
    }
})