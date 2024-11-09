import { StyleSheet, Text, TextInput, View, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { COLOR, commonStyles, hp, TEXT_STYLE, wp } from '../../enums/StyleGuide';
import { AppHeader, BackBtn, Label, Photo, Pressable, ProgressCircle, Scrollable, } from '../../components';
import { En } from '../../locales/En';
import { getDocumentData } from '../../services/FirebaseMethods';
import { FIREBASE_COLLECTIONS } from '../../enums/AppEnums';
import firestore from '@react-native-firebase/firestore'
import * as Animatable from 'react-native-animatable';

const AnimatableView = Animatable.createAnimatableComponent(View);


const StudentsProgressScreen = (props) => {
    const { courseData } = props?.route?.params;
    const [students, setStudents] = useState([]);
    const [lectures, setLectures] = useState([]);
    const [selectedStudentProgress, setSelectedStudentProgress] = useState(null); // State for selected student's progress




    useEffect(() => {
        const fetchStudentsData = async () => {
            try {
                if (courseData?.startedBy?.length > 0) {
                    const studentDataPromises = courseData.startedBy.map(async (studentId) => {
                        const userDoc = await getDocumentData(FIREBASE_COLLECTIONS.USERS, studentId);
                        return userDoc ? userDoc : null;
                    });
                    const studentsData = await Promise.all(studentDataPromises);
                    const validStudents = studentsData.filter((student) => student !== null);
                    setStudents(validStudents);
                }
            } catch (error) {
                console.error('Error fetching student data:', error);
            }
        };

        fetchStudentsData();
    }, [courseData]);

    useEffect(() => {
        const fetchCoursesByTitle = () => {
            try {
                if (courseData?.title) {
                    const unsubscribe = firestore()
                        .collection(FIREBASE_COLLECTIONS.ONLINE_LECTURES)
                        .where('category', '==', courseData.title)
                        .onSnapshot((snapshot) => {
                            if (snapshot.empty) {
                                console.warn('No matching documents found for this category.');
                                setLectures([]); // Clear the lectures if no documents are found
                            } else {
                                const fetchedCourses = snapshot.docs.map(doc => ({ ...doc.data() }));
                                setLectures(fetchedCourses);
                            }
                        }, (error) => {
                            console.error('Error fetching courses:', error);
                        });

                    // Clean up the subscription on unmount
                    return () => unsubscribe();
                }
            } catch (error) {
                console.error('Error setting up Firestore listener:', error);
            }
        };

        fetchCoursesByTitle("selectedStudentProgress", selectedStudentProgress);
    }, [courseData.title]);

    const calculateProgress = (studentId) => {

        const completedLecturesCount = lectures.filter(lecture => lecture.completedBy?.includes(studentId)).length;
        const totalLectures = lectures.length;
        const percentage = totalLectures > 0 ? (completedLecturesCount / totalLectures) * 100 : 0;
        const studentData = students.find(student => student.uid === studentId);
        return { studentData, completedLecturesCount, percentage, totalLectures };
    };

    const handleStudentPress = (student) => {
        const progress = calculateProgress(student.uid);
        setSelectedStudentProgress({ ...progress });
    };

    // console.log("selectedStudentProgress", selectedStudentProgress)




    return (
        <View style={commonStyles.container}>
            <AppHeader
                leftComp={<BackBtn />}
                title={En.studentsProgress}
            />

            <Scrollable bounce={true} containerStyle={styles.scrollViewContent}>

                <Label style={styles.enrollstudent}>Enroll Students</Label>

                <View style={styles.studentsMainContainer} >
                    <Scrollable horizontal containerStyle={styles.studentsMainView}>
                        {
                            students.map((item, index) => (
                                <Pressable
                                    animation="slideInLeft"
                                    delay={index * 300}
                                    key={item.uid}
                                    style={styles.studentCard}
                                    onPress={() => handleStudentPress(item)} // Update onPress to use the new function
                                >
                                    <Photo url={item?.profileImage.url} style={styles.studentProfileImage} />
                                    <Label style={styles.studentname}>{item?.name}</Label>
                                </Pressable>
                            ))
                        }
                    </Scrollable>
                </View>

                {
                    !selectedStudentProgress && <Label style={styles.selectStudentText}>Select student first!</Label>
                }

                {
                    selectedStudentProgress &&
                    <AnimatableView animation="fadeIn" duration={1000}>
                        <Label style={styles.enrolStudentText}>Check progress of {selectedStudentProgress?.studentData?.name}</Label>
                    </AnimatableView>

                }

                {
                    selectedStudentProgress &&
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
                }

                {
                    selectedStudentProgress &&
                    <AnimatableView animation="bounceIn" duration={1000} delay={400} style={styles.progressCircle}>
                        <Label style={[styles.totalLectureheading, { marginBottom: hp(1) }]}>Progress</Label>
                        <ProgressCircle
                            heading={En.totalLectures}
                            percentage={selectedStudentProgress?.percentage}
                        />
                    </AnimatableView>

                }
            </Scrollable>

        </View>
    );
}

export default StudentsProgressScreen;

const styles = StyleSheet.create({
    enrolStudentText: {
        ...TEXT_STYLE.textBold,
        marginVertical: hp(2),
        color: COLOR.purple,
        textAlign: 'center'
    },
    enrollstudent: {
        ...TEXT_STYLE.textBold,
        color: COLOR.purple,
    },
    studentProfileImage: {
        width: hp(8),
        height: hp(8),
        borderRadius: hp(5),
        borderWidth: 0.5,
        borderColor: COLOR.light_grey2,
    },
    studentCard: {
        width: hp(15),
        height: hp(15),
        backgroundColor: COLOR.white,
        borderRadius: 10,
        paddingVertical: hp(2),
        paddingHorizontal: wp(4),
        marginHorizontal: wp(2),
        shadowColor: COLOR.purple,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    studentsMainView: {
        marginVertical: hp(2)
    },
    studentname: {
        ...TEXT_STYLE.textSemiBold,
        marginTop: hp(1.5),
        color: COLOR.purple
    },
    progressContainer: {
        marginTop: hp(2),
        padding: wp(4),
        borderRadius: 10,
        backgroundColor: COLOR.light_grey,
    },
    progressHeading: {
        ...TEXT_STYLE.textSemiBold,
        color: COLOR.purple,
    },
    progressText: {
        ...TEXT_STYLE.textRegular,
        color: COLOR.grey,
        marginTop: hp(1),
    },
    studentsMainContainer: {
        borderBottomWidth: 2,
        borderBottomColor: COLOR.purple
    },
    lectureCountView: {
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

    },
    progressMainView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly'
    },
    selectStudentText: {
        ...TEXT_STYLE.textSemiBold,
        color: COLOR.purple,
        textAlign: 'center',
        marginTop: "auto",
        marginBottom: 'auto'
    },
    scrollViewContent: {
        flexGrow: 1,
        paddingBottom: hp(4), // Add padding if needed for the bottom content
    },
});
