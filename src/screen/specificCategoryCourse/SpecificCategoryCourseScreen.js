import { StyleSheet, Text, View, FlatList} from 'react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { COLOR, commonStyles, hp, TEXT_STYLE, wp } from '../../enums/StyleGuide';
import { AppHeader, BackBtn, ConfirmationModal, CustomIcon, EmptyContainer, Label, Loader, Photo, VideoThumbnil ,Pressable} from '../../components';
import { textLimit } from '../../utils/MyUtils';
import { useSelector } from 'react-redux';
import { ACC_TYPE, FIREBASE_COLLECTIONS, SCREEN } from '../../enums/AppEnums';
import firestore from '@react-native-firebase/firestore'
import { getDocumentData, saveData } from '../../services/FirebaseMethods';

const SpecificCategoryCourseScreen = (props) => {
    const { courseId } = props?.route?.params;
    const [courseDetail, setCourseDetail] = useState([])
    const { navigation } = props;
    const user = useSelector(({ appReducer }) => appReducer.user);
    const [loading, setLoading] = useState(true);
    const [videos, setVideos] = useState([]);
    const [teacher, setTeacher] = useState('');
    const [openConfirmModal, setOpenConfirmModal] = useState(false)
    const [selectedItem, setSelectedItem] = useState('')
    const [modalLoading, setModalLoading] = useState(false)
    const [fullScreenLoading, setFullScreenLoading] = useState(true)
    const [lecLoading, setLecLoading] = useState(true)
    const [corLoading, setCorLoading] = useState(true)

    useEffect(() => {
        const unsubscribe = firestore()
            .collection(FIREBASE_COLLECTIONS.COURSES)
            .doc(courseId)
            .onSnapshot(async (doc) => {
                if (doc.exists) {
                    const courseData = doc.data() || {};
                    setCourseDetail(courseData);

                    // Fetch teacher data if createdBy field is present
                    if (courseData?.createdBy) {
                        try {
                            const teacherData = await getDocumentData(FIREBASE_COLLECTIONS.USERS, courseData.createdBy);
                            setTeacher(teacherData || '');
                        } catch (error) {
                            console.log("Error while getting teacher Data", error);
                        }
                    }
                    setCorLoading(false);
                } else {
                    console.error("No such document found!");
                    setCourseDetail({});
                    setCorLoading(false);
                }
            }, (error) => {
                console.error("Error fetching course details:", error);
                setCorLoading(false);
            });

        // Cleanup the subscription when the component unmounts
        return () => unsubscribe();
    }, [courseId]);

    useEffect(() => {
        if (courseDetail?.title) {
            // Function to fetch videos and listen for real-time updates
            const unsubscribe = firestore()
                .collection(FIREBASE_COLLECTIONS.ONLINE_LECTURES)
                .where('category', '==', courseDetail.title)
                .orderBy('createdAt', 'desc')
                .onSnapshot((snapshot) => {
                    if (!snapshot.empty) {
                        // Map through the snapshot to get the updated videos
                        const fetchedVideos = snapshot.docs.map((doc) => doc.data());

                        // Update state only if the videos have actually changed
                        setVideos((prevVideos) => {
                            if (JSON.stringify(prevVideos) !== JSON.stringify(fetchedVideos)) {
                                return fetchedVideos;
                            }
                            return prevVideos;
                        });
                    } else {
                        // If no videos are found, clear the videos state
                        setVideos([]);
                    }
                    setLecLoading(false);
                }, (error) => {
                    console.error("Error fetching videos:", error);
                    setLecLoading(false);
                });

            // Clean up the listener when the component unmounts or when course title changes
            return () => unsubscribe();
        }
    }, [courseDetail?.title]);


    const handleConfirmaton = async () => {
        if (selectedItem) {
            if (courseDetail?.startedBy?.includes(user?.uid))
                navigation.navigate(SCREEN.VIDEO_SCREEN, { videoData: selectedItem });
            else {
                try {
                    setModalLoading(true)
                    const updatedStartedBy = courseDetail?.startedBy ? [...courseDetail?.startedBy] : [];
                    updatedStartedBy.push(user?.uid);
                    await saveData(FIREBASE_COLLECTIONS.COURSES, courseDetail?.documentId, { startedBy: updatedStartedBy })
                    navigation.navigate(SCREEN.VIDEO_SCREEN, { videoData: selectedItem });
                } catch (error) {
                    console.log("Error while started course", error)
                    setModalLoading(false)
                } finally {
                    setModalLoading(false)
                    setSelectedItem('')
                    setOpenConfirmModal(false)

                }
            }
        } else {
            console.log("Item not selected")
        }

    };

    const handleVideoPress = (videoData) => {

        if (user?.accType === ACC_TYPE.TEACHER) {
            navigation.navigate(SCREEN.VIDEO_SCREEN, { videoData: videoData });
        } else if (courseDetail?.startedBy?.includes(user?.uid)) {
            navigation.navigate(SCREEN.VIDEO_SCREEN, { videoData: videoData });
        } else {
            setSelectedItem(videoData)
            setOpenConfirmModal(true)
        }

    }

    const moveToChat = (secondUser) => {
        const currentUserStr = user?.uid.toString()
        const otherUserStr = secondUser?.toString()
        const sortedUserIds = [currentUserStr, otherUserStr].sort()
        const chatId = sortedUserIds.join('_')
        navigation.navigate(SCREEN.CHAT, { chatId: chatId, userDetail: teacher })
    }

    const onClose = () => {
        setSelectedItem('')
        setOpenConfirmModal(false)
    }

    useEffect(() => {
        if (!lecLoading && !corLoading) {
            setFullScreenLoading(false);
        }
    }, [lecLoading, corLoading]);
    return (
        <View style={commonStyles.container}>
            <AppHeader
                leftComp={<BackBtn />}
                centerComp={<Label style={styles.headerCenter}>{textLimit(courseDetail?.title, 50)}</Label>}
                rightComp={
                    user?.accType === ACC_TYPE.TEACHER ?
                        <Pressable onPress={() => navigation.navigate(SCREEN.COURSE_UPLOAD, { category: courseDetail?.title })}>
                            <CustomIcon name="progress-upload" family='MaterialCommunityIcons' size={hp(5)} />
                        </Pressable>
                        : null
                }
            />

            {
                fullScreenLoading ?
                    <Loader />
                    :
                    <>
                        <View style={styles.courseDetailView}>
                            {
                                user?.accType === ACC_TYPE.STUDENT &&
                                <Pressable hitSlop={ {top: 40, bottom: 40, left: 40, right: 40} } style={styles.chatBtn} onPress={() => { 
                                    moveToChat(teacher?.uid); 
                                }}>
                                    <CustomIcon name="chatbubble-ellipses-outline" family="Ionicons" size={hp(3.5)} color={COLOR.purple} />
                                </Pressable>
                            }

                            <View style={commonStyles.horizontalView_m1}>
                                <Photo url={teacher?.profileImage?.url} style={styles.imageView} />
                                <Label style={styles.teachername}>{teacher?.name}</Label>
                            </View>
                            <View style={styles.courseInfoContainer}>
                                <Label style={styles.courseDetailHeading}>Course Details:</Label>
                                <Label style={styles.courseDetailValue}>
                                    {courseDetail?.details ? courseDetail.details : 'n/a'}
                                </Label>
                                <Label style={styles.courseDetailHeading}>Objective:</Label>
                                {
                                    courseDetail?.objective && courseDetail.objective.length > 0 ? (
                                        courseDetail.objective.map((item, index) => (
                                            <Label key={index} style={styles.objectiveText}>
                                                {index + 1}. {item} {/* Numbered objectives */}
                                            </Label>
                                        ))
                                    ) : (
                                        <Label style={styles.objectiveText}>n/a</Label>
                                    )
                                }
                                <Label style={styles.courseDetailHeading}>Course Fees:</Label>
                                <Label style={styles.coursePrice}> {courseDetail?.paid ? `$ ${courseDetail?.price}` : 'Free Course'} <Label style={styles.purchasedText}>{courseDetail?.access?.includes(user?.uid) ? "(Purchased)" : null}</Label></Label>
                            </View>
                        </View>
                        <FlatList
                            data={videos}
                            ListEmptyComponent={videos.length === 0 ? <EmptyContainer text="Currently no lectures available!" /> : null}
                            showsVerticalScrollIndicator={false}
                            scrollEnabled={videos.length > 0}
                            renderItem={({ item, index }) => {
                                const isCompleted = item?.completedBy?.includes(user?.uid) ? true : false
                                return (
                                    <VideoThumbnil
                                        key={index}
                                        item={item}
                                        isCompleted={isCompleted}
                                        teacher={teacher}
                                        onPress={() => handleVideoPress(item)}
                                        index
                                    />
                                )
                            }}
                            contentContainerStyle={styles.videoList}
                        />
                    </>
            }

            <ConfirmationModal
                visible={openConfirmModal}
                onClose={onClose}
                courseTitle={courseDetail?.title}
                onApply={handleConfirmaton}
                loading={modalLoading}

            />
        </View>
    );
};

export default SpecificCategoryCourseScreen;

const styles = StyleSheet.create({
    headerCenter: {
        width: "70%",
        ...TEXT_STYLE.bigTextSemiBold,
        color: COLOR.purple,
    },
    videoList: {
        paddingVertical: hp(2),
        paddingHorizontal: wp(1)
    },
    courseDetailView: {
        marginVertical: hp(1),
        borderRadius: hp(1.5),
        paddingHorizontal: wp(2),
        paddingVertical: hp(1),
        backgroundColor: COLOR.white,
        elevation: 5, // Android shadow
        shadowColor: "#000", // iOS shadow
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        position: 'relative'
    },
    imageView: {
        width: hp(8),
        height: hp(8),
        borderRadius: hp(10),
        backgroundColor: COLOR.grey,
    },
    teachername: {
        ...TEXT_STYLE.bigTextSemiBold,
        paddingHorizontal: wp(4),
    },
    courseInfoContainer: {
        paddingHorizontal: wp(2),
    },
    courseDetailHeading: {
        ...TEXT_STYLE.smallTextSemiBold,
        textDecorationLine: 'underline',
        marginTop: hp(1),
    },
    courseDetailValue: {
        textAlign: "justify",
        marginVertical: hp(0.5),
        ...TEXT_STYLE.smallText
    },
    objectiveText: {
        textAlign: "justify",
        ...TEXT_STYLE.smallText

    },
    coursePrice: {
        ...TEXT_STYLE.textSemiBold,
        color: COLOR.purple,
        marginVertical: hp(0.5),
        textAlign: 'center',
    },
    chatBtn: {
        position: 'absolute',
        right: "5%",
        top: "5%"
    },
    purchasedText:{
        ...TEXT_STYLE.smallTextSemiBold,
        color:COLOR.red
    }
});
