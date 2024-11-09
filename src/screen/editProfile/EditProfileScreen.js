import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { COLOR, commonStyles, hp } from '../../enums/StyleGuide'
import { AppHeader, BackBtn, Button, CustomIcon, Input, Photo, Pressable, ProfileModal, RadioBtn, Scrollable } from '../../components'
import { En } from '../../locales/En'
import { FIREBASE_COLLECTIONS, KEYBOARD_TYPE, STORAGE_FOLDERS } from '../../enums/AppEnums'
import { useDispatch, useSelector } from 'react-redux'
import { deleteImage, getDocumentData, saveData, uploadImage } from '../../services/FirebaseMethods'
import { setUser } from '../../redux/action/Action'
import { showFlash } from '../../utils/MyUtils'

const EditProfileScreen = () => {
  const genderOptions = ['Male', 'Female']

  const user = useSelector(({ appReducer }) => appReducer.user);
  const [image, setImage] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber)
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const [gender, setGender] = useState(user?.gender);
  const [name, setname] = useState(user?.name)


  const handleEdit = async () => {
    const updatedData = {};

    try {
      setLoading(true)
      if (image && image !== user?.profileImage?.url) {
        const filename = user?.profileImage?.filename;
        await deleteImage(STORAGE_FOLDERS.PROFILE_IMAGES, filename);
        const uploadResult = await uploadImage(STORAGE_FOLDERS.PROFILE_IMAGES, image);
        updatedData.profileImage = {
          url: uploadResult?.url,
          filename: uploadResult?.filename,
        };
      }
      if (gender !== user?.gender) {
        updatedData.gender = gender;
      }
      if (name !== user?.name) {
        updatedData.name = name;
      }

      if (phoneNumber !== user?.phoneNumber) {
        updatedData.phoneNumber = phoneNumber;
      }

      if (Object.keys(updatedData).length > 0) {
        await saveData(FIREBASE_COLLECTIONS.USERS, user?.uid, updatedData);
        const data = await getDocumentData(FIREBASE_COLLECTIONS.USERS, user?.uid)
        dispatch(setUser(data));
        showFlash("Update Successfully");
      } else {
        showFlash("No changes detected.");
      }
    } catch (error) {
      console.log("error", error)
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }

  const hanldeClose = () => {
    setShowModal(false)
    setImage('')
  }



  return (
    <View style={commonStyles.container}>
      <AppHeader
        leftComp={<BackBtn />}
        title={En.editProfile}
      />

      <Scrollable hasInput containerStyle={styles.scrollContainer}>

        <Pressable style={styles.imagePress} onPress={() => setShowModal(true)}>
          {
            image ?
              <Photo src={{ uri: image }} style={styles.profileImage} />
              :
              <Photo url={user?.profileImage?.url} style={styles.profileImage} />
          }
        </Pressable>
        <View>
          <Input
            inputLabel={En.name}
            value={name}
            onChange={(e)=>setname(e)}
          />

          <Input
            inputLabel={En.contactNo}
            placeholder={!user?.phoneNumber ? "not available": "" }
            keyboard={KEYBOARD_TYPE.PHONE_PAD}
            value={phoneNumber}
            onChange={(e)=>setPhoneNumber(e)}
          />

          <RadioBtn
            options={genderOptions}
            title={'Gender'}
            selectedValue={gender}
            onSelect={setGender}
          />
        </View>


        <Button
          text={En.update}
          onPress={handleEdit}
          isLoading={loading}
        />

      </Scrollable>
      <ProfileModal
        visible={showModal}
        onClose={() => hanldeClose()}
        setImage={setImage}
        setShowModal={setShowModal}
      />
    </View>
  )
}

export default EditProfileScreen

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    justifyContent: 'space-evenly'
  },
  profileImage: {
    width: hp(15),
    height: hp(15),
    borderRadius: hp(10),
    borderWidth: 0.75,
    borderColor: COLOR.light_grey2,
  },
  imagePress: {
    alignSelf: 'center'
  }
})