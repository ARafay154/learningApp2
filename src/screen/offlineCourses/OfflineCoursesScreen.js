import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { COLOR, commonStyles, hp, TEXT_STYLE, wp } from '../../enums/StyleGuide'
import { AppHeader, BackBtn, CustomDrawer, EmptyContainer, Label, OpenDrawer, Pressable } from '../../components'
import { En } from '../../locales/En'
import { useSelector } from 'react-redux'
import { ACC_TYPE, FIREBASE_COLLECTIONS, SCREEN } from '../../enums/AppEnums'
import firestore from '@react-native-firebase/firestore'


const OfflineCoursesScreen = ({ navigation }) => {
  const user = useSelector(({ appReducer }) => appReducer.user);
  const [courses, setCourses] = useState([]);
  const [openDrawer, setOpenDrawer] = useState('');

  useEffect(() => {
    const unsubscribe = firestore()
      .collection(FIREBASE_COLLECTIONS.COURSES)
      .where('paid', '==', false) // Filter for paid courses
      .orderBy('createdAt', 'desc')
      .onSnapshot(
        querySnapshot => {
          // Check if querySnapshot is valid
          if (!querySnapshot) {
            console.error("Query snapshot is null.");
            setCourses([]);
            return;
          }

          if (querySnapshot.empty) {
            console.log("No courses found.");
            setCourses([]);
            return;
          }

          const coursesData = querySnapshot.docs.map(doc => ({
            id: doc.id, // Include document ID
            ...doc.data()
          }));

        

          if (user?.accType === ACC_TYPE.TEACHER) {
            const teacherCourses = coursesData.filter(course => course?.createdBy === user?.uid);
           
            setCourses(teacherCourses);
          } else {
            setCourses(coursesData);
          }
        },
        error => {
          console.error("Error fetching courses: ", error);
        }
      );

    return () => unsubscribe();
  }, [user?.accType]);

  return (
    <View style={commonStyles.container}>
      <AppHeader
        leftComp={<OpenDrawer setOpen={() => setOpenDrawer(true)} />}
        title={En.offlineCourses}
        rightComp={
          user?.accType === ACC_TYPE.TEACHER ?
            <Pressable onPress={() => navigation.navigate(SCREEN.NEW_COURSE, { paid: false })}>
              <Label style={styles.addCourseText}>Add Course</Label>
            </Pressable>
            : null
        }
      />

      <FlatList
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<EmptyContainer text={"No course found!"}/>}
        data={courses}
        renderItem={({ index, item }) => {
          const isStarted = item?.startedBy?.includes(user?.uid) ? true : false
          return (
            <Pressable
            key={index}
            animation="slideInDown" // Changed to slideInDown for top entrance
            delay={item.index * 300}
            style={styles.card}
            onPress={() => navigation.navigate(SCREEN.SPECIFIC_CAT_COURSE, { courseId: item?.documentId })}
          >
            <Label numberOfLines={1} style={styles.cardText}>{item?.title}</Label>
            { isStarted &&  <Label style={styles.startedText}>started</Label>}
          </Pressable>
          )
        }}
        contentContainerStyle={styles.flatListContainer}
      />
       <CustomDrawer isVisible={openDrawer} onClose={() => setOpenDrawer(false)} />
    </View>
  )
}

export default OfflineCoursesScreen

const styles = StyleSheet.create({
  addCourseText: {
    ...TEXT_STYLE.smallTextSemiBold,
    backgroundColor: COLOR.purple,
    color: COLOR.white,
    padding: "2%",
    borderRadius: hp(0.5)
  },
  card: {
    height: hp(8),
    marginVertical: hp(1.5),
    marginHorizontal: wp(1),
    borderRadius: hp(1),
    backgroundColor: COLOR.white,
    borderColor: COLOR.purple,
    justifyContent:'center',
    paddingHorizontal: wp(4),
    // Shadow for elevation
    shadowColor: COLOR.purple,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  cardText: {
    ...TEXT_STYLE.textBold,
    paddingHorizontal: wp(4),
    color:COLOR.purple
  },
  flatListContainer: {
    paddingBottom: hp(4),
  },
  startedText:{
    ...TEXT_STYLE.smallTextSemiBold,
    color:COLOR.red,
    textAlign:'right'
  }
})