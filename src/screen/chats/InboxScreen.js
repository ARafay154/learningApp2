import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import { commonStyles } from '../../enums/StyleGuide'
import { AppHeader, BackBtn, ChatBubble, CustomDrawer, EmptyContainer, OpenDrawer } from '../../components'
import { En } from '../../locales/En'
import { FIREBASE_COLLECTIONS } from '../../enums/AppEnums'
import { useSelector } from 'react-redux'
import firestore from '@react-native-firebase/firestore'
import { getDocumentData } from '../../services/FirebaseMethods'

const InboxScreen = () => {
  const userData = useSelector(({ appReducer }) => appReducer.user);
  const [chats, setChats] = useState([]);
  const memoizedChats = useMemo(() => chats, [chats]);
  const [openDrawer, setOpenDrawer] = useState('');


  const getOtherParticipant = async (participants) => {
    const otherUserId = participants.find((participant) => participant !== userData?.uid);
    if (otherUserId) {
      const otherUser = await getDocumentData(FIREBASE_COLLECTIONS.USERS, otherUserId);
      return otherUser;
    }
  };

  useEffect(() => {
    if (userData?.uid) {
      const conversationsRef = firestore()
        .collection(FIREBASE_COLLECTIONS.CHATS)
        .where('participants', 'array-contains', userData?.uid);

      const unsubscribe = conversationsRef?.onSnapshot(async (querySnapshot) => {
        const fetchedConversations = [];

        for (const doc of querySnapshot?.docs) {
          const chatId = doc?.id;
          const conversation = doc?.data();
          const lastMessage = conversation?.lastMessage;
          const otherParticipant = await getOtherParticipant(conversation.participants);

          const unreadMessagesSnapshot = await firestore()
            .collection(FIREBASE_COLLECTIONS.CHATS)
            .doc(chatId)
            .collection(FIREBASE_COLLECTIONS.MESSAGES)
            .where('receiver', '==', userData?.uid)
            .where('messageSeen', '==', false)
            .get();

          const unreadMessagesCount = unreadMessagesSnapshot.size;

          fetchedConversations.push({
            id: chatId,
            lastMessage,
            unreadMessagesCount,
            ...otherParticipant,
          });
        }
        fetchedConversations.sort((a, b) => {
          const now = Date.now();  // Current time in milliseconds

          const timeA = a.lastMessage?.timestamp?.toMillis() || 0;
          const timeB = b.lastMessage?.timestamp?.toMillis() || 0;

          const diffA = now - timeA;
          const diffB = now - timeB;

          return diffA - diffB;
        });

        setChats([...fetchedConversations]);


      });

      return () => unsubscribe();
    }
  }, [userData?.uid]);


  return (
    <View style={commonStyles.container}>
      <AppHeader
        leftComp={<OpenDrawer setOpen={() => setOpenDrawer(true)} />}
        title={En.inbox}
      />

      <FlatList
        data={memoizedChats}
        ListEmptyComponent={memoizedChats.length === 0 ? <EmptyContainer text={"No chats found."} /> : null}
        scrollEnabled={memoizedChats.length > 0}
        renderItem={({ item, index }) => (
          <ChatBubble item={item} key={index} />
        )}
      />
<CustomDrawer isVisible={openDrawer} onClose={() => setOpenDrawer(false)} />

    </View>
  )
}

export default InboxScreen

const styles = StyleSheet.create({})