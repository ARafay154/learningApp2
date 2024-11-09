import { StyleSheet, View, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { COLOR, commonStyles, hp, TEXT_STYLE, wp } from '../../enums/StyleGuide';
import { AppHeader, BackBtn, CustomDrawer, CustomIcon, EmptyContainer, Label, OpenDrawer, Pressable } from '../../components';
import { En } from '../../locales/En';
import { ACC_TYPE, FIREBASE_COLLECTIONS, SCREEN } from '../../enums/AppEnums';
import { useSelector } from 'react-redux';
import firestore from '@react-native-firebase/firestore'



const OnlineCoursesScreen = ({ navigation }) => {
  const user = useSelector(({ appReducer }) => appReducer.user);
  const [courses, setCourses] = useState([]);
  const [openDrawer, setOpenDrawer] = useState('');



  useEffect(() => {
    const unsubscribe = firestore()
      .collection(FIREBASE_COLLECTIONS.COURSES)
      .where('paid', '==', true) // Filter for paid courses
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


  const checkPayment = (item) => {
    if (user?.accType === ACC_TYPE.TEACHER) {
      navigation.navigate(SCREEN.SPECIFIC_CAT_COURSE, { courseId: item?.documentId })
    } else if (item?.access?.includes(user?.uid)) {
      navigation.navigate(SCREEN.SPECIFIC_CAT_COURSE, { courseId: item?.documentId })
    } else {
      navigation.navigate(SCREEN.PAYMENT_SCREEN, { courseDetails: item });
    }
  };



  return (
    <View style={commonStyles.container}>
      <AppHeader
        leftComp={<OpenDrawer setOpen={() => setOpenDrawer(true)} />}
        title={En.onlineCourses}
        rightComp={
          user?.accType === ACC_TYPE.TEACHER ?
            <Pressable onPress={() => navigation.navigate(SCREEN.NEW_COURSE, { paid: true })}>
              <Label style={styles.addCourseText}>Add Course</Label>
            </Pressable>
            : null
        }
      />

      <FlatList
        showsVerticalScrollIndicator={false}
        data={courses}
        ListEmptyComponent={<EmptyContainer text={"No course found!"} />}
        renderItem={({ index, item }) => {
          const isStarted = item?.startedBy?.includes(user?.uid) ? true : false
          const isAccess = item?.access?.includes(user?.uid) ? true : false
          return (
            <Pressable
              key={index}
              animation="slideInDown" // Changed to slideInDown for top entrance
              delay={item.index * 300}
              style={styles.card}
              onPress={() => checkPayment(item)}
            >
              <Label numberOfLines={1} style={styles.cardText}>{item?.title}</Label>
              <View style={[commonStyles.horizontalView, { alignSelf: 'flex-end' }]}>
                {isAccess && <CustomIcon name={"paid"} family='MaterialIcons'  size={hp(2.25)}/>}
                {isStarted && <Label style={[styles.startedText, { marginLeft: wp(2) }]}>started</Label>}
              </View>

            </Pressable>
          )
        }}
        contentContainerStyle={styles.flatListContainer}
      />

      <CustomDrawer isVisible={openDrawer} onClose={() => setOpenDrawer(false)} />
    </View>
  );
};

export default OnlineCoursesScreen;

const styles = StyleSheet.create({
  card: {
    height: hp(8),
    marginVertical: hp(1.5),
    marginHorizontal: wp(1),
    borderRadius: hp(1),
    backgroundColor: COLOR.white,
    borderColor: COLOR.purple,
    justifyContent: 'center',
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
    color: COLOR.purple
  },
  flatListContainer: {
    paddingBottom: hp(4),
  },
  addCourseText: {
    ...TEXT_STYLE.smallTextSemiBold,
    backgroundColor: COLOR.purple,
    color: COLOR.white,
    padding: "2%",
    borderRadius: hp(0.5)
  },
  startedText: {
    ...TEXT_STYLE.smallTextSemiBold,
    color: COLOR.red,
    textAlign: 'right'
  }
});
