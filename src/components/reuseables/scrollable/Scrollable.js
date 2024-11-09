import { ScrollView } from 'react-native'
import React, { memo } from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import If from '../if'

const Scrollable = (props) => {
    const { children, hasInput, horizontal, containerStyle,scrollEnable=true,bounce= false } = props
    return (
        <If condition={hasInput}
            elseComp={
                <ScrollView
                    overScrollMode='never'
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={containerStyle}
                    horizontal={horizontal}
                    bounces={bounce}
                    scrollEnabled={scrollEnable}
                >
                    {children}
                </ScrollView>
            }
        >
            <KeyboardAwareScrollView
                overScrollMode='never'
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={containerStyle}
                horizontal={horizontal}
                bounces={bounce}
                scrollEnabled={scrollEnable}
            >
                {children}
            </KeyboardAwareScrollView>
        </If>
    )
}

export default memo(Scrollable)
