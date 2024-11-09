import { Alert, Keyboard, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { COLOR, commonStyles, hp, TEXT_STYLE } from '../../enums/StyleGuide'
import { AppHeader, BackBtn, Button, Input, Label, Pressable } from '../../components'
import { En } from '../../locales/En'
import ImagePicker from 'react-native-image-crop-picker'
import { isIOS, showFlash } from '../../utils/MyUtils'
import storage from '@react-native-firebase/storage'
import { addDocument, saveData } from '../../services/FirebaseMethods'
import { useSelector } from 'react-redux'
import { FIREBASE_COLLECTIONS, SCREEN } from '../../enums/AppEnums'
import firestore from '@react-native-firebase/firestore'

const CourseuploadScreen = (props) => {
  const { navigation } = props
  const { category } = props?.route?.params

  const user = useSelector(({ appReducer }) => appReducer.user);
  const [title, setTitle] = useState('')
  const [video, setVideo] = useState('')
  const [uploading, setUploading] = useState(false);
  const [percentage, setPercentage] = useState(0);


  const openGallery = () => {
    ImagePicker.openPicker({
      mediaType: 'video',
      cropping: false
    })
      .then((video) => {
        if (video && video.path) {
          setVideo(video)
        } else {
          showFlash(En.validVideo)
        }
      })
  }

  const uploadVideo = async () => {

    Keyboard.dismiss()

    if (!title) {
      showFlash("Enter video title")
      return;
    }
    if (!video) {
      showFlash("Select video for upload")
      return;
    }

    const uri = video?.path
    const filename = uri.substring(uri.lastIndexOf('/') + 1)
    const uploadUri = isIOS() ? uri.replace('file://', '') : uri
    const task = storage().ref(`${"Online_Lectures"}/${filename}`).putFile(uploadUri)

    setUploading(true);
    setPercentage(0);

    task.on('state_changed', (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setPercentage(Math.round(progress));
    });

    try {
      await task
      const url = await storage().ref(`${"Online_Lectures"}/${filename}`).getDownloadURL()
      if (url) {
        const videoData = {
          category: category,
          title: title,
          url: url,
          filename: filename,
          duration: video?.duration,
          createdBy: user?.uid
        }
        await addDocument(FIREBASE_COLLECTIONS.ONLINE_LECTURES, videoData)
        navigation.goBack()
      }
    } catch (e) {
      console.log(e)
      showFlash("Failed to upload video. Please try again.");
    } finally {
      setUploading(false);
      setTitle('')
      setVideo('')
      setPercentage(0)
    }
  }





  return (
    <View style={commonStyles.container}>
      <AppHeader
        leftComp={<BackBtn />}
        title={En.uploadNewLecture}
        style={styles.headerStyle}
      />

      <Label style={styles.categoryLabel}>Course Title</Label>
      <Label style={styles.categoryText}>{category}</Label>

      <Input
        inputLabel={En.lectureTitle}
        placeholder={En.writeHere}
        onChange={(e) => setTitle(e)}
        value={title}
      />

      <Pressable onPress={() => openGallery()}>
        <Label style={styles.addVideoText}>Add Video</Label>
      </Pressable>

      {
        video && <Label style={styles.videoSelectedText}>Video is selected</Label>
      }


      {percentage > 0 && <Label style={styles.pctText}>{percentage} %</Label>}

      {
        title && video &&
        <Button
          onPress={() => uploadVideo()}
          text={En.upload}
          style={styles.btnStyle}
          isLoading={uploading}
        />
      }
    </View>
  )
}

export default CourseuploadScreen

const styles = StyleSheet.create({
  addVideoText: {
    ...TEXT_STYLE.smallTextBold,
    textAlign: 'center',
    marginVertical: hp(2),
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    color: COLOR.purple
  },
  headerStyle: {
    marginBottom: hp(2)
  },
  btnStyle: {
    marginTop: hp(4)
  },
  pctText: {
    textAlign: 'center',
    marginVertical: hp(2),
    color: COLOR.purple,
    ...TEXT_STYLE.smallTextBold
  },
  categoryLabel: {
    ...TEXT_STYLE.textSemiBold,
    color: COLOR.purple
  },
  categoryText: {
    ...TEXT_STYLE.textSemiBold,
    textAlign: 'center',
    marginVertical: hp(1.5),
  },
  videoSelectedText: {
    textAlign: 'center',
    ...TEXT_STYLE.smallText,
    color: COLOR.light_grey
  }
})