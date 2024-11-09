import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { AppHeader, BackBtn, CustomDrawer, EmptyContainer, Label, OpenDrawer, Pressable } from '../../components'
import { COLOR, commonStyles, hp, TEXT_STYLE, wp } from '../../enums/StyleGuide'
import { En } from '../../locales/En'
import { useSelector } from 'react-redux'
import firestore from '@react-native-firebase/firestore'
import { ACC_TYPE, FIREBASE_COLLECTIONS, SCREEN } from '../../enums/AppEnums'


const ProgressScreen = ({ navigation }) => {

  const user = useSelector(({ appReducer }) => appReducer.user);
  const [teacherCourses, setTeacherCourses] = useState([])
  const [studentCourses, setStudentCourses] = useState([])
  const [fetchLoading, setFetchLoading] = useState(false)
  const [openDrawer, setOpenDrawer] = useState('');



  useEffect(() => {
    if (user?.accType === ACC_TYPE.TEACHER) {
      const getTeacherCourses = () => {
        try {
          const coursesRef = firestore().collection(FIREBASE_COLLECTIONS.COURSES);
          const query = coursesRef
            .where('createdBy', '==', user?.uid)
            .orderBy('createdAt', 'desc');

          const unsubscribe = query.onSnapshot(
            (snapshot) => {
              if (snapshot && !snapshot.empty) {
                // Map and filter courses with studentCount > 0
                const coursesData = snapshot.docs
                  .map((doc) => ({
                    ...doc.data(),
                  }))
                  .filter((course) => course.startedBy && course.startedBy.length > 0); // Filtering based on studentCount

                setTeacherCourses(coursesData);
              } else {
                setTeacherCourses([]);
              }
            },
            (error) => {
              console.error('Error fetching courses:', error);
            }
          );

          return unsubscribe;
        } catch (error) {
          console.error('Error setting up listener:', error);
        }
      };

      const unsubscribe = getTeacherCourses();
      return () => unsubscribe && unsubscribe();
    }
  }, [user?.uid]);

  useEffect(() => {
    if (user?.accType !== ACC_TYPE.TEACHER) {
      const getStudentCourses = () => {
        try {
          const coursesRef = firestore().collection(FIREBASE_COLLECTIONS.COURSES);
          const query = coursesRef
            .where('startedBy', 'array-contains', user?.uid)
            .orderBy('createdAt', 'desc');

          const unsubscribe = query.onSnapshot(
            (snapshot) => {
              if (snapshot && !snapshot.empty) {
                const coursesData = snapshot.docs.map((doc) => ({
                  ...doc.data(),
                }));
                setStudentCourses(coursesData);
              } else {
                setStudentCourses([]);
              }
            },
            (error) => {
              console.error('Error fetching courses for student:', error);
            }
          );

          return unsubscribe;
        } catch (error) {
          console.error('Error setting up listener for student:', error);
        }
      };

      const unsubscribe = getStudentCourses();
      return () => unsubscribe && unsubscribe();
    }
  }, [user?.uid, user?.accType]);


  return (
    <View style={commonStyles.container}>
      <AppHeader 
       leftComp={<OpenDrawer setOpen={() => setOpenDrawer(true)} />}
      title={En.progress} />

      {user?.accType === ACC_TYPE.TEACHER ? (
        <>
          <Label style={styles.teacherSubText}>
            Hi teacher {user?.name}! You can see courses below in which students have enrolled or started.
          </Label>

          <FlatList
            data={teacherCourses}
            ListEmptyComponent={
              <EmptyContainer
                text="Currently, no student has enrolled in any course."
                textStyle={styles.noStudentText}
              />
            }
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => {
              const studentCount = item?.startedBy?.length;
              return (
                <Pressable
                  key={index}
                  animation="slideInDown"
                  delay={item.index * 300}
                  style={styles.card}
                  onPress={() =>
                    navigation.navigate(SCREEN.STUDENTS_PROGRESS, { courseData: item })
                  }
                >
                  <Label numberOfLines={1} style={styles.cardText}>
                    {item?.title}
                  </Label>
                  {studentCount > 0 && (
                    <Label numberOfLines={1} style={styles.countSubText}>
                      Students enrolled: <Label style={styles.studentcountText}>{studentCount}</Label>
                    </Label>
                  )}
                </Pressable>
              );
            }}
          />
        </>
      ) : (

        <>
        <Label style={styles.teacherSubText}>
            Hi {user?.name}! You can see the courses below that you have started.
          </Label>
        <FlatList
          data={studentCourses}
          ListEmptyComponent={
            <EmptyContainer
              text="You are not enrolled in any courses yet."
              textStyle={styles.noStudentText}
            />
          }
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <Pressable
              key={index}
              animation="slideInDown"
              delay={item.index * 300}
              style={styles.card}
              onPress={() =>
                navigation.navigate(SCREEN.SINGLE_STUDENT_PROGRESS, { courseData: item })
              }
            >
              <Label numberOfLines={1} style={styles.cardText}>
                {item?.title}
              </Label>
            </Pressable>
          )}
        />

</>
      )}

<CustomDrawer isVisible={openDrawer} onClose={() => setOpenDrawer(false)} />
    </View>

  )
}

export default ProgressScreen

const styles = StyleSheet.create({
  card: {
    paddingTop: hp(1),
    height: hp(9),
    marginVertical: hp(1.5),
    marginHorizontal: wp(1),
    borderRadius: hp(1),
    backgroundColor: COLOR.white,
    borderColor: COLOR.purple,
    paddingHorizontal: wp(4),
    // Center content vertically
    justifyContent: 'center',
    // Shadow for elevation
    shadowColor: COLOR.purple,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  cardText: {
    ...TEXT_STYLE.textSemiBold,
    paddingHorizontal: wp(4),
    color: COLOR.purple
  },
  countSubText: {
    ...TEXT_STYLE.smallTextSemiBold,
    textAlign: 'right'

  },
  studentcountText: {
    ...TEXT_STYLE.textBold,
    color: COLOR.purple,
    marginHorizontal: wp(2)
  },
  teacherSubText: {
    ...TEXT_STYLE.textSemiBold,
    color: COLOR.purple,
    marginVertical: hp(2)
  },
  noStudentText: {
    ...TEXT_STYLE.smallTextSemiBold,
    color: COLOR.red
  }
})