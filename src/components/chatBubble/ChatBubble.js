import { StyleSheet, Text, View } from 'react-native'
import React, { memo } from 'react'
import { Label, Photo, Pressable } from '../reuseables'
import { COLOR, commonStyles, hp, TEXT_STYLE, wp } from '../../enums/StyleGuide'
import { useNavigation } from '@react-navigation/native'
import { SCREEN } from '../../enums/AppEnums'
import { calculateTimeDifference, textLimit } from '../../utils/MyUtils'

const ChatBubble = ({ item }) => {
    const navigation = useNavigation()
    const formateTime = calculateTimeDifference(item?.lastMessage?.timestamp) || ''
   

   
  const moveToChat = () => {
    navigation.navigate(SCREEN.CHAT, { chatId: item?.id, userDetail: item })
  }


    return (
        <Pressable onPress={moveToChat} style={styles.card}>

            <View style={styles.textContainer}>
                <Photo url={item?.profileImage?.url} style={styles.profileImage} />
                <View style={styles.detailView}>
                    <View style={[commonStyles.justifyView]}>
                        <Label numberOfLines={1} style={styles.label}>{textLimit(item?.name, 15)}</Label>
                        <Label style={styles.timeText}>{formateTime}</Label>
                    </View>
                    <View style={commonStyles.justifyView}>
                        <Label style={[styles.subText,]}>{textLimit(item?.lastMessage?.message, 25)}</Label>
                        {
                            item?.unreadMessagesCount !== 0 ?
                                <View style={styles.unreadCount}>
                                    <Label style={styles.unreadCountText}>{item?.unreadMessagesCount}</Label>
                                </View>
                                :
                                null
                        }
                    </View>

                </View>
            </View>

        </Pressable>
    )
}

export default memo(ChatBubble)

const styles = StyleSheet.create({
    card: {
       
        marginVertical: hp(1.5),
        borderRadius: hp(1),
        backgroundColor: COLOR.white,
        borderColor: COLOR.purple,
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: wp(4),
        // Shadow for elevation
        shadowColor: COLOR.purple,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
        marginHorizontal: wp(1),
        paddingVertical:hp(1.5)
    },
    cardText: {
        ...TEXT_STYLE.textSemiBold,
        paddingHorizontal: wp(4)
    },
    profileImage: {
        width: hp(6),
        height: hp(6),
        borderRadius: hp(4),
        backgroundColor: COLOR.light_grey
    },
    textContainer: {
        flex: 1,
        flexDirection: 'row',
    },
    detailView:{
        flex:1,
        marginLeft:wp(2)
      },
      timeText:{
        ...TEXT_STYLE.smallText,
        color:COLOR.grey
      },
      label:{
        ...TEXT_STYLE.bigTextSemiBold
      },
      subText:{
        ...TEXT_STYLE.smallTextMedium
      },
      unreadCount:{
        backgroundColor:COLOR.red,
        width:hp(3),
        height:hp(3),
        borderRadius:hp(4),
        ...commonStyles.center
      },
      unreadCountText:{
        color:COLOR.white,
        ...TEXT_STYLE.textSemiBold
      },

})