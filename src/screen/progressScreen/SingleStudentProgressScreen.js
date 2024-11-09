import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { COLOR, commonStyles, hp, TEXT_STYLE, wp } from '../../enums/StyleGuide';
import { AppHeader, BackBtn, Label, ProgressCircle } from '../../components';
import { FIREBASE_COLLECTIONS } from '../../enums/AppEnums';
import firestore from '@react-native-firebase/firestore';
import { useSelector } from 'react-redux';
import { En } from '../../locales/En';
import * as Animatable from 'react-native-animatable';

const AnimatableView = Animatable.createAnimatableComponent(View);

const SingleStudentProgressScreen = (props) => {
  const user = useSelector(({ appReducer }) => appReducer.user);
  const { courseData } = props?.route?.params;
  const [lectures, setLectures] = useState([]);
  const [selectedStudentProgress, setSelectedStudentProgress] = useState(null);

  useEffect(() => {
    // Fetch lectures based on the course title
    const fetchCoursesByTitle = () => {
      try {
        if (courseData?.title) {
          const unsubscribe = firestore()
            .collection(FIREBASE_COLLECTIONS.ONLINE_LECTURES)
            .where('category', '==', courseData.title)
            .onSnapshot(
              (snapshot) => {
                if (snapshot.empty) {
                  console.warn('No matching documents found for this category.');
                  setLectures([]); // Clear lectures if no documents are found
                } else {
                  const fetchedCourses = snapshot.docs.map((doc) => ({ ...doc.data() }));
                  setLectures(fetchedCourses);

                  // Calculate and set progress after lectures are fetched
                  const progress = calculateProgress(user?.uid, fetchedCourses);
                  setSelectedStudentProgress(progress);
                }
              },
              (error) => {
                console.error('Error fetching courses:', error);
              }
            );

          // Clean up the subscription on unmount
          return () => unsubscribe();
        }
      } catch (error) {
        console.error('Error setting up Firestore listener:', error);
      }
    };

    fetchCoursesByTitle();
  }, [courseData.title]);

  // Function to calculate progress
  const calculateProgress = (studentId, lecturesData) => {
    const completedLecturesCount = lecturesData.filter((lecture) =>
      lecture.completedBy?.includes(studentId)
    ).length;
    const totalLectures = lecturesData.length;
    const percentage = totalLectures > 0 ? (completedLecturesCount / totalLectures) * 100 : 0;
    return { completedLecturesCount, percentage, totalLectures };
  };

  return (
    <View style={commonStyles.container}>
      <AppHeader leftComp={<BackBtn />} title={courseData?.title} />

      {selectedStudentProgress && (
        <AnimatableView animation="fadeIn" duration={1000}>
          <Label style={styles.enrolStudentText}>Your progress is shown below</Label>
        </AnimatableView>
      )}

      {selectedStudentProgress && (
        <AnimatableView animation="slideInUp" duration={1000} delay={200} style={styles.progressMainView}>
          <View style={styles.circleMainView}>
            <Label style={styles.totalLectureheading}>{En.totalLectures}</Label>
            <Label style={styles.lectureCountText}>{selectedStudentProgress?.totalLectures}</Label>
          </View>

          <View style={styles.circleMainView}>
            <Label style={styles.totalLectureheading}>{En.completedLecture}</Label>
            <Label style={styles.lectureCountText}>{selectedStudentProgress?.completedLecturesCount}</Label>
          </View>
        </AnimatableView>
      )}

      {selectedStudentProgress && (
        <AnimatableView animation="bounceIn" duration={1000} delay={400} style={styles.progressCircle}>
          <Label style={[styles.totalLectureheading, { marginBottom: hp(1) }]}>Progress</Label>
          <ProgressCircle heading={En.totalLectures} percentage={selectedStudentProgress?.percentage} />
        </AnimatableView>
      )}
    </View>
  );
};

export default SingleStudentProgressScreen;

const styles = StyleSheet.create({
    enrolStudentText: {
        ...TEXT_STYLE.textBold,
        marginVertical: hp(2),
        color: COLOR.purple,
        textAlign:'center'
    },
    progressMainView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly'
    },
    circleMainView: {
        width: "45%",
        height: hp(20),
        borderRadius: hp(2),
        backgroundColor: COLOR.white,
        elevation: 5,
        shadowColor: COLOR.purple,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        alignItems: 'center',
        justifyContent: 'space-evenly',
        marginVertical: hp(2)
    },
    totalLectureheading: {
        ...TEXT_STYLE.bigTextBold,
        color: COLOR.purple,
    },
    lectureCountText: {
        height: hp(10),
        width: hp(10),
        borderRadius: hp(8),
        backgroundColor: COLOR.purple,
        color: COLOR.white,
        textAlign: 'center',
        textAlignVertical: 'center',
        ...TEXT_STYLE.smallTitleBold,
    },
    progressCircle: {
        alignSelf: 'center',
        paddingVertical: hp(2),
        paddingHorizontal: wp(8),
        borderRadius: hp(2),
        backgroundColor: COLOR.white,
        elevation: 5,
        shadowColor: COLOR.purple,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        alignItems: 'center',
        justifyContent: 'space-evenly',
        marginVertical:hp(2)

    },
    totalLectureheading: {
        ...TEXT_STYLE.bigTextBold,
        color: COLOR.purple,
    },
});
