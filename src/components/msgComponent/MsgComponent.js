import { StyleSheet, View } from 'react-native';
import React, { memo } from 'react';

import { CustomIcon, Label, Pressable } from '../reuseables';
import { COLOR, TEXT_STYLE, hp, wp } from '../../enums/StyleGuide';
import { calculateTime } from '../../utils/MyUtils';

const MsgComponent = ({ item, isSender, onPress }) => {
    return (
        <>
            <View style={[styles.mainContainer, isSender && styles.senderMessage]}>
                <View style={[styles.messageContainer, isSender ? styles.senderBackground : styles.receiverBackground]}>
                    <Label style={isSender ? styles.messageTextSender : styles.messageTextReceiver}>{item?.message}</Label>
                </View>
            </View>
            <View style={isSender ? styles.utilityBoxSender:styles.utilityBoxReceiver}>
                {isSender ? (
                    <Pressable style={{marginHorizontal:wp(1)}} onPress={onPress}>
                        <CustomIcon name="delete-forever" family="MaterialCommunityIcons" size={hp(3)} color={COLOR.purple} />
                    </Pressable>
                ) : null}
                <Label style={[styles.timeText, isSender && { textAlign: 'right' }]}>
                    {calculateTime(item?.timestamp)}
                </Label>
            </View>
        </>
    );
};

export default memo(MsgComponent);

const styles = StyleSheet.create({
    mainContainer: {
        alignSelf: 'flex-start',
        marginVertical: hp(0.8),
    },
    messageContainer: {
        maxWidth: wp(60),
        borderRadius: hp(1.8),
        paddingVertical: hp(1),
        paddingHorizontal: wp(1),
        paddingHorizontal:"4%"
    },
    senderMessage: {
        alignSelf: 'flex-end',
    },
    senderBackground: {
        backgroundColor: COLOR.lightPurple,
        borderRadius: hp(1.5),
    },
    receiverBackground: {
        backgroundColor: COLOR.lightPurple,
        borderRadius: hp(1.5),
    },
    messageTextSender: {
        ...TEXT_STYLE.text,
        textAlign: 'right'
    },

    messageTextReceiver: {
        ...TEXT_STYLE.text,
        textAlign: 'left'
    },
    timeText: {
        ...TEXT_STYLE.smallText,
        marginTop: hp(0.3),
        color: COLOR.light_grey,
    },
    utilityBoxSender: {
        flexDirection: 'row',
        marginVertical: '1%',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginHorizontal:wp(2)
    },
    utilityBoxReceiver: {
        flexDirection: 'row',
        marginVertical: '1%',
        alignItems: 'center',
        justifyContent: "flex-start",
        marginHorizontal:wp(2)
    },
});
