import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { COLOR, commonStyles, hp, TEXT_STYLE, wp } from '../../enums/StyleGuide';
import { AppHeader, BackBtn, ConfirmationModal, CustomIcon, EmptyContainer, Input, Label, LectureEdit, Loader, Photo, Pressable, Scrollable } from '../../components';
import { ACC_TYPE, FIREBASE_COLLECTIONS, SCREEN } from '../../enums/AppEnums';
import { En } from '../../locales/En';
import { useSelector } from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import { formatDate, showFlash, textLimit } from '../../utils/MyUtils';
import Video from 'react-native-video';
import { getDocumentData, saveData } from '../../services/FirebaseMethods';

const VideoScreen = (props) => {
  const { videoData } = props?.route?.params;

  const { navigation } = props;
  const user = useSelector(({ appReducer }) => appReducer.user);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviews, setReviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEditLectureModal, setShowEditLectureModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true);
  const [paused, setPaused] = useState(false)
  const [teacher, setTeacher] = useState('');
  const [modalLoading, setModalLoading] = useState(false)
  const [openConfirmModal, setOpenConfirmModal] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [videoLoader, setVideoLoader] = useState(false)

  // console.log("VideoData=>>>>", videoData)

  const getTeacherData = async () => {
    if (videoData?.createdBy) {
      try {
        const teacherData = await getDocumentData(FIREBASE_COLLECTIONS.USERS, videoData?.createdBy);
        setTeacher(teacherData || '');
      } catch (error) {
        console.log("Error while getting teacher Data", error);
      }
    }
  };


  useEffect(() => {
    getTeacherData()
    const videoDocRef = firestore().collection(FIREBASE_COLLECTIONS.ONLINE_LECTURES).doc(videoData?.documentId);

    // Firestore snapshot listener to fetch reviews
    const unsubscribe = videoDocRef.onSnapshot((doc) => {
      const data = doc.data();
      if (data && data.reviews) {
        // Sort reviews by createdAt timestamp in descending order
        const sortedReviews = data.reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setReviews(sortedReviews);
      }
    });

    // Cleanup the listener on component unmount
    return () => unsubscribe();
  }, [videoData?.documentId]);

  // Function to update rating on star press
  const handleRatingPress = (index) => setRating(index + 1);

  const handleReviewSubmit = async () => {
    if (isSubmitting || rating === 0 || !reviewText) {
      showFlash("Add review as well as give rating star to this video")
      return; // Prevent further submissions
    }

    setIsSubmitting(true); // Set submitting state

    const newReview = {
      stars: rating,
      text: reviewText,
      createdAt: new Date().toISOString(),
      createdBy: user?.uid,
      creatorName: user?.name
    };

    try {
      const videoDocRef = firestore().collection(FIREBASE_COLLECTIONS.ONLINE_LECTURES).doc(videoData?.documentId);

      await videoDocRef.update({
        reviews: firestore.FieldValue.arrayUnion(newReview),
      });

      showFlash("Review submitted successfully!");
      setReviewText("");
      setRating(0);
    } catch (error) {

      showFlash("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false); // Reset submitting state
    }
  };


  const handleNavigation = (route, data) => {
    setPaused(true)
    navigation.navigate(route, data)
  }


  const moveToChat = (secondUser) => {
    const currentUserStr = user?.uid.toString()
    const otherUserStr = secondUser?.toString()
    const sortedUserIds = [currentUserStr, otherUserStr].sort()
    const chatId = sortedUserIds.join('_')
    navigation.navigate(SCREEN.CHAT, { chatId: chatId, userDetail: teacher })
  }


  const handleVideoEnd = () => {
    if (user?.accType === ACC_TYPE.STUDENT && !videoData?.completedBy?.includes(user?.uid)) {
      setOpenConfirmModal(true);
    }
  };



  const handleConfirmaton = async () => {
    if (!videoData?.completedBy?.includes(user?.uid)) {
      try {
        setPaused(true)
        setModalLoading(true)
        const updatedCompletedBy = videoData?.completedBy ? [...videoData.completedBy] : [];
        updatedCompletedBy.push(user.uid);
        await saveData(FIREBASE_COLLECTIONS.ONLINE_LECTURES, videoData?.documentId, { completedBy: updatedCompletedBy })
        setOpenConfirmModal(false)
      } catch (error) {
        console.log("Error while started course", error)
        setModalLoading(false)
      } finally {
        setModalLoading(false)
      }
    }
  }


  // const handleAlreadyCompleted = async () => {
  //   try {
  //     setModalLoading(true)
  //     const updatedCompletedBy = videoData?.completedBy ? [...videoData.completedBy] : [];
  //     updatedCompletedBy.push(user.uid);
  //     await saveData(FIREBASE_COLLECTIONS.ONLINE_LECTURES, videoData?.documentId, { completedBy: updatedCompletedBy })
  //     navigation.goBack()
  //   } catch (error) {
  //     console.log("Error while started course", error)
  //     setModalLoading(false)
  //   } finally {
  //     setModalLoading(false)
  //   }
  // }



  return (
    <View style={[commonStyles.container, styles.container]}>
      {
        user?.accType === ACC_TYPE.STUDENT ?
          <AppHeader
            leftComp={<BackBtn />}
            centerComp={
              <Label style={styles.studentHeaderCentertext}>{textLimit(videoData?.category, 25)}</Label>
            }
          />
          :
          <AppHeader
            leftComp={<BackBtn />}
            rightComp={
              user?.accType === ACC_TYPE.TEACHER ?
                <View style={styles.rightViewHeader}>
                  <Pressable onPress={() => setShowEditLectureModal(true)}>
                    <Label style={styles.addQuizText}>Edit Lecture</Label>
                  </Pressable>
                  {/* <Pressable onPress={() => navigation.navigate(SCREEN.ADD_QUIZ, { videoDocId: videoData?.documentId })}> */}

                  <Pressable onPress={() => handleNavigation(SCREEN.ADD_QUIZ, { videoDocId: videoData?.documentId })}>
                    <Label style={styles.addQuizText}>Add Quiz</Label>
                  </Pressable>
                </View>
                : null
            }
          />
      }

<Scrollable scrollEnable={!videoLoader} containerStyle={{flexGrow:1,marginBottom:hp(5)}} >

      {
        videoLoader &&
        <Loader style={styles.videoLoader} />
      }

      <Video
        source={{ uri: videoData?.url }}
        style={styles.videoPlayer}
        controls
        resizeMode="contain"
        paused={paused}
        onLoadStart={() => setVideoLoader(true)}
        onLoad={() => setVideoLoader(false)}
        onError={() => setVideoLoader(false)}
        onEnd={handleVideoEnd}

      />


     

        <View style={styles.detailsView}>
          <Label style={styles.videoTitle}>{videoData?.title}</Label>

          <Label style={styles.publishText}>Publish By</Label>
          <View style={commonStyles.justifyView}>
            <View style={styles.nameView}>
              {
                teacher?.profileImage ?
                  <Photo url={teacher?.profileImage?.url} style={styles.profileImage} />
                  :
                  <CustomIcon name="circle-user" family="FontAwesome6" size={hp(6)} color={COLOR.purple} />
              }
              <Label style={styles.publisherName}>{teacher?.name}</Label>
            </View>
            {
              user?.accType === ACC_TYPE.STUDENT &&
              <Pressable onPress={() => moveToChat(teacher?.uid)}>
                <CustomIcon name="chatbubble-ellipses-outline" family="Ionicons" size={hp(4)} color={COLOR.purple} />
              </Pressable>
            }

          </View>

          <View style={{}}>
            {/* {
              user?.accType === ACC_TYPE.STUDENT && !videoData?.completedBy?.includes(user?.uid) ?
                <Pressable onPress={() => handleAlreadyCompleted()}>
                  {
                    modalLoading ?
                      <Loader size='small' style={{marginVertical:0, paddingLeft:wp(2)}} color={COLOR.red} />
                      :
                      <Label style={styles.alreadyCompletedText}>Already completed?</Label>
                  }

                </Pressable>
                :
                <View>
                   <Label style={styles.completd}>watched</Label>
                </View>
            } */}

            {
              user?.accType === ACC_TYPE.STUDENT &&
              <Pressable onPress={() => handleNavigation(SCREEN.QUIZ_ATTEMPT, { videoDocId: videoData?.documentId })}>
                <Label style={styles.quizTestText}>Take Quiz Test</Label>
              </Pressable>
            }
          </View>


          {
            user?.accType === ACC_TYPE.STUDENT &&
            <View style={[styles.reviewBox, !videoData?.quizId ? { marginTop: hp(4) } : null]}>
              <View style={styles.starContainer}>
                {[...Array(5)].map((_, index) => (
                  <Pressable key={index} onPress={() => handleRatingPress(index)}>
                    <CustomIcon
                      name="star"
                      family="FontAwesome"
                      size={hp(3.5)}
                      color={index < rating ? COLOR.yellow : COLOR.white}
                      style={styles.starIcon}
                    />
                  </Pressable>
                ))}
              </View>

              <Input
                placeholder={En.writeReviewHere}
                iconName="checkmark-done-circle-outline"
                iconFamily="Ionicons"
                iconSize={hp(4)}
                value={reviewText}
                onChange={(text) => setReviewText(text)}
                iconPress={() => handleReviewSubmit()}
                disabled={isSubmitting}
              />
            </View>
          }




          <Label style={styles.reviewTexts}>Reviews</Label>

          {/* Replace FlatList with map */}
          {reviews.length === 0 ? (
            <EmptyContainer textStyle={{ marginVertical: hp(1) }} text={"No reviews"} />
          ) : (
            reviews.map((item, index) => (
              <View key={index} style={styles.reviewCardBox}>
                <View style={styles.reviewCardAboveView}>
                  <Label style={styles.createdByText}>By {item?.creatorName}</Label>
                  <Label style={styles.createdAtText}>{formatDate(item?.createdAt)}</Label>
                </View>
                {/* Review Text */}
                <Label style={styles.reviewText}>{item?.text}</Label>
                {/* Stars */}
                <View style={styles.starContainer}>
                  {[...Array(5)].map((_, starIndex) => (
                    <CustomIcon
                      key={starIndex}
                      name="star"
                      family="FontAwesome"
                      size={hp(2)}
                      color={starIndex < item?.stars ? COLOR.purple : COLOR.white} // Correct comparison
                      style={styles.starIcon}
                    />
                  ))}
                </View>
              </View>
            ))
          )}
        </View>

        <LectureEdit
          data={videoData}
          visible={showEditLectureModal}
          notVisible={setShowEditLectureModal}

        />

        <ConfirmationModal
          visible={openConfirmModal}
          onClose={() => setOpenConfirmModal(false)}
          //  courseTitle={courseDetail?.title}
          confirmation={'end'}
          onApply={handleConfirmaton}
          loading={modalLoading}
        />
      </Scrollable>
    </View>
  );
};

export default VideoScreen;

const styles = StyleSheet.create({
  container: {
    padding: "2%",
    paddingBottom:hp(10)
  },
  // videoPlayer: {
  //   width: "100%",
  //   height: hp(40),
  //   marginVertical: hp(1),
  // },
  detailsView: {
    flex: 1,
    paddingHorizontal: wp(2),
    paddingTop: hp(2),
  },
  videoTitle: {
    ...TEXT_STYLE.bigTextBold,
    textDecorationLine: 'underline',
    marginBottom: hp(1),
  },
  nameView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(1),
    paddingHorizontal: wp(1),
  },
  publishText: {
    ...TEXT_STYLE.textSemiBold,
  },
  publisherName: {
    ...TEXT_STYLE.bigTextBold,
    color: COLOR.purple,
    paddingHorizontal: wp(4),
  },
  reviewBox: {
    padding: "5%",
    backgroundColor: COLOR.light_grey2,
    borderRadius: hp(2),
    marginTop: hp(2),
  },
  starContainer: {
    flexDirection: 'row',
    marginTop: hp(1),
  },
  starIcon: {
    marginHorizontal: wp(0.5),
  },
  quizTestText: {
    backgroundColor: COLOR.purple,
    alignSelf: 'flex-end',
    marginVertical: hp(2),
    color: COLOR.white,
    paddingVertical: "1%",
    paddingHorizontal: "5%",
    borderRadius: hp(1)
  },
  alreadyCompletedText: {
    backgroundColor: COLOR.red,
    alignSelf: 'flex-start',
    color: COLOR.white,
    paddingVertical: "1%",
    paddingHorizontal: "5%",
    borderRadius: hp(1)
  },
  completd: {
    color: COLOR.red,
    alignSelf: 'flex-start',
    paddingVertical: "1%",
    paddingHorizontal: "5%",
    borderRadius: hp(1),
    ...TEXT_STYLE.smallTextBold,
    textDecorationLine: 'underline'
  },
  addQuizText: {
    ...TEXT_STYLE.smallTextSemiBold,
    backgroundColor: COLOR.purple,
    color: COLOR.white,
    padding: "2%",
    borderRadius: hp(0.5),
    marginRight: wp(4)
  },
  reviewTexts: {
    ...TEXT_STYLE.textSemiBold,
    textDecorationLine: 'underline',
    marginTop: hp(4),
    marginBottom: hp(2)
  },
  reviewCardBox: {
    paddingVertical: hp(1),
    paddingHorizontal: wp(4),
    backgroundColor: COLOR.light_grey2,
    borderRadius: hp(2),
    marginVertical: hp(1),
  },
  createdAtText: {
    ...TEXT_STYLE.smallTextMedium, // Assuming you have a small text style
    color: COLOR.grey, // Optional: color for the date
    textAlign: 'right',
    width: "30%"
  },
  reviewCardAboveView: {
    width: "100%",
    flexDirection: 'row',
    marginBottom: hp(0.5)
  },
  createdByText: {
    width: "70%",
    ...TEXT_STYLE.smallTextSemiBold,
  },
  reviewText: {
    ...TEXT_STYLE.textRegular,
  },
  rightViewHeader: {
    flexDirection: 'row'
  },
  videoContainer: {
  },
  videoPlayer: {
    width: "100%",
    height: hp(35),
  },
  videoLoader: {
    width: "100%",
    height: hp(35),
  },
  loadingOverlay: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  profileImage: {
    width: hp(6),
    height: hp(6),
    borderRadius: hp(6),
    borderWidth: 0.5,
    borderColor: COLOR.light_grey2
  },
  studentHeaderCentertext: {
    ...TEXT_STYLE.bigTextSemiBold,
    color: COLOR.purple
  }

});
