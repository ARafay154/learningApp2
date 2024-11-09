import React, { memo } from 'react';
import { CustomIcon, Label, Photo, Pressable } from '../reuseables';
import { COLOR, commonStyles, hp, TEXT_STYLE, wp } from '../../enums/StyleGuide';
import { StyleSheet, View } from 'react-native';
import { calculateTimeDifference } from '../../utils/MyUtils';

const VideoThumbnil = ({ item, onPress, index, isCompleted ,teacher }) => {
   

    return (
        <Pressable style={styles.card} onPress={onPress}>
            <CustomIcon name="video" family='Octicons' size={hp(4)} />
            <View style={styles.rightView} >
                <Label numberOfLines={2} style={styles.title}>{item?.title}</Label>
                <View style={commonStyles.horizontalView}>
                    <Label style={styles.uploadText}>Upload By:</Label>
                    <Label style={styles.uploadByText}>{teacher?.name}</Label>
                </View>

                <Label style={styles.timeText}>{calculateTimeDifference(item?.createdAt)}</Label>
                {
                    isCompleted && <Label style={styles.completedText}>completed</Label>
                }


            </View>



        </Pressable>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLOR.white,
        borderRadius: 10,
        marginBottom: hp(2),
        shadowColor: COLOR.purple,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
        padding: "2%",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    title: {
        ...TEXT_STYLE.bigTextSemiBold,
        color: COLOR.black,
    },
    rightView: {
        width: "85%"
    },
    uploadText: {
        ...TEXT_STYLE.smallText,
    },
    uploadByText: {
        ...TEXT_STYLE.smallTextSemiBold,
        paddingHorizontal: wp(2),
        color: COLOR.purple
    },
    timeText: {
        ...TEXT_STYLE.smallText,
        color: COLOR.purple
    },
    completedText:{
        ...TEXT_STYLE.smallTextSemiBold,
        color:COLOR.red,
        textAlign:'right',
        paddingHorizontal:wp(2)
    }
});

export default VideoThumbnil;
