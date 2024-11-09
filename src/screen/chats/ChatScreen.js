import { FlatList, Keyboard, Platform, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { COLOR, commonStyles, hp, TEXT_STYLE, wp } from '../../enums/StyleGuide'
import { AppHeader, BackBtn, CustomIcon, Input, Label, MsgComponent, Photo, Pressable } from '../../components'
import { En } from '../../locales/En'
import { useSelector } from 'react-redux'
import { FIREBASE_COLLECTIONS } from '../../enums/AppEnums'
import firestore from '@react-native-firebase/firestore'

const ChatScreen = (props) => {
  const { chatId, userDetail } = props?.route?.params

  const flatListRef = useRef()
  const [messages, setMessages] = useState([])
  const [inputText, setInputText] = useState('')
  const userData = useSelector(({ appReducer }) => appReducer.user);
  const memoizedMessages = useMemo(() => messages, [messages])
  const [sendDisable, setSendDisable] = useState(false)

  useEffect(() => {
    const messagesRef = firestore()
      .collection(FIREBASE_COLLECTIONS.CHATS)
      .doc(chatId)
      .collection(FIREBASE_COLLECTIONS.MESSAGES)
      .orderBy('timestamp', 'asc')

    const unsubscribe = messagesRef.onSnapshot(async (querySnapshot) => {
      const fetchedMessages = []

      querySnapshot.forEach(async (doc) => {
        const messageObj = doc?.data()

        fetchedMessages.push({
          id: doc?.id,
          ...messageObj,
        })

        if (messageObj?.receiver == userData?.uid) {
          await firestore()
            .collection(FIREBASE_COLLECTIONS.CHATS)
            .doc(chatId)
            .collection(FIREBASE_COLLECTIONS.MESSAGES)
            .doc(doc?.id)
            .set({ messageSeen: true }, { merge: true })
            .catch(function (error) {
              console.error(t('errorWritingText'), error)
            })
        }

      })

      setMessages(fetchedMessages)

      if (fetchedMessages?.length != 0) {
        flatListRef.current?.scrollToEnd({ animated: true })
      }

    })

    return () => unsubscribe()
  }, [chatId, messages?.length])


  const handleSendMessage = async () => {
    if (inputText) {
      setSendDisable(true)
      Keyboard.dismiss()
      const getOtherParticipant = (id) => {
        const participants = id?.split('_')
        return participants.find((participant) => participant !== userData?.uid)
      }

      const sender = userData?.uid

      const receiver = getOtherParticipant(chatId)

      const chatRef = firestore().collection(FIREBASE_COLLECTIONS.CHATS).doc(chatId)
      const messagesRef = chatRef.collection(FIREBASE_COLLECTIONS.MESSAGES)

      const chatDoc = await chatRef.get()
      if (!chatDoc.exists) {
        await chatRef.set({
          participants: [sender, receiver],
        })
      }

      const formattedMessage = {
        sender,
        receiver,
        message: inputText,
        timestamp: firestore.FieldValue.serverTimestamp(),
        messageSeen: false,
      }

      await messagesRef
        .add(formattedMessage)
        .then(() => {
          setInputText('')
        })
        .catch((error) => console.log(error))
        setSendDisable(false)

      await chatRef.set({ lastMessage: formattedMessage }, { merge: true })
    }
  }

  const renderMessage = ({ item, index }) => (
    <MsgComponent
        key={index}
        item={item}
        isSender={userData?.uid == item?.sender}
        onPress={() => handleDeleteMsg(item.id)}
    />
  )

  const handleDeleteMsg = async (id) => {
    try {
        const messagesRef = firestore()
            .collection(FIREBASE_COLLECTIONS.CHATS)
            .doc(chatId)
            .collection(FIREBASE_COLLECTIONS.MESSAGES)
            .orderBy('timestamp', 'asc');

        const unsubscribe = messagesRef.onSnapshot(async (querySnapshot) => {
            const fetchedMessages = [];

            querySnapshot.forEach(async (doc) => {
                const messageObj = doc?.data();

                fetchedMessages.push({
                    id: doc?.id,
                    ...messageObj,
                });

                if (doc.id === id) {
                    await firestore()
                        .collection(FIREBASE_COLLECTIONS.CHATS)
                        .doc(chatId)
                        .collection(FIREBASE_COLLECTIONS.MESSAGES)
                        .doc(doc.id)
                        .delete()
                        .catch((error) => {
                            console.error('Error deleting message:', error);
                        });
                } else if (messageObj?.receiver === userData?.uid) {
                    await firestore()
                        .collection(FIREBASE_COLLECTIONS.CHATS)
                        .doc(chatId)
                        .collection(FIREBASE_COLLECTIONS.MESSAGES)
                        .doc(doc.id)
                        .set({ messageSeen: true }, { merge: true })
                        .catch((error) => {
                            console.error('Error marking message as seen:', error);
                        });
                }
            });

            setMessages(fetchedMessages);
        });

        // Unsubscribe from snapshot listener when done to avoid memory leaks
        return () => unsubscribe();
    } catch (error) {
        console.error('Error handling messages:', error);
    }
};

  return (
    <View style={styles.container}>
      <AppHeader
        leftComp={<BackBtn />}
        centerComp={
          <View style={styles.headerCenterComponent}>
            {
              userDetail?.profileImage ?
                <Photo url={userDetail?.profileImage?.url} style={styles.otherUserPhoto} />
                :
                <View style={styles.photoView}>

                </View>
            }

            <Label numberOfLines={1} style={styles.headerTitle}>{userDetail?.name}</Label>
          </View>
        }
        style={styles.headerStyle}
      />

      <FlatList
        bounces={false}
        ref={flatListRef}
        overScrollMode='never'
        data={memoizedMessages}
        renderItem={renderMessage}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.chatDetailsContainer}
        ListEmptyComponent={
          <View style={styles.emptyMessageContainer}>
            <Text style={styles.emptyMessageText}>No messages found</Text>
          </View>
        }
      />

      <View style={styles.newMsgContainer}>
        <TextInput
          placeholder={"Send a new message"}
          placeholderTextColor={COLOR.purple}
          style={styles.inputMainContainer}
          value={inputText}
          onChangeText={setInputText} // Correctly use onChangeText
        />
        <Pressable onPress={handleSendMessage} disabled={sendDisable}>
          <CustomIcon name="send-circle-outline" family="MaterialCommunityIcons" size={hp(5)} color={COLOR.purple} />
        </Pressable>
      </View>


    </View>
  )
}

export default ChatScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerTitle: {
    color: COLOR.purple,
    ...TEXT_STYLE.bigTextBold,
    paddingHorizontal: wp(2),
  },
  headerStyle: {
    borderBottomWidth: 0.75,
    borderBottomColor: COLOR.purple,
    paddingHorizontal: "5%",
    marginVertical: hp(1),
  },
  photoView: {
    width: hp(6),
    height: hp(6),
    borderRadius: hp(4),
    backgroundColor: COLOR.light_grey,
  },
  otherUserPhoto: {
    width: hp(6),
    height: hp(6),
    borderRadius: hp(4),
    borderWidth: 0.5,
    borderColor: COLOR.light_grey2,
  },
  headerCenterComponent: {
    flexDirection: 'row',
    alignItems: 'center',
    width: "75%",
  },
  chatDetailsContainer: {
    paddingHorizontal: '5%',
    flexGrow: 1,
    justifyContent: 'flex-end', 
  },
  emptyMessageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyMessageText: {
    color: COLOR.purple,
    ...TEXT_STYLE.mediumText,
  },
  newMsgContainer: {
    
    ...commonStyles.justifyView,
    paddingVertical: hp(1.5),
    borderTopWidth: 2,
    borderTopColor: COLOR.purple,
    paddingHorizontal: wp(2),
    marginBottom: Platform.OS === "ios" ? hp(4): null
  },
  inputMainContainer: {
    width: '87%',
    borderBottomWidth: 1,
    borderBottomColor: COLOR.purple,
    color: COLOR.purple,
  },
  messageText: {
    color: COLOR.black, 
    ...TEXT_STYLE.regularText,
    marginVertical: hp(0.5), 
  },
});