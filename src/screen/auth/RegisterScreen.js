import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { COLOR, commonStyles, hp, TEXT_STYLE } from '../../enums/StyleGuide'
import { Button, CustomIcon, Input, Label, Photo, Pressable, ProfileModal, RadioBtn, Scrollable } from '../../components'
import { En } from '../../locales/En'
import { SCREEN, STORAGE_FOLDERS } from '../../enums/AppEnums'
import { isEmailValid, isStrongPassword, showFlash } from '../../utils/MyUtils'
import { signUp, uploadImage } from '../../services/FirebaseMethods'

const RegisterScreen = ({ navigation }) => {

  const genderOptions = ['Male', 'Female']
  const accountOptions = ['Teacher', 'Student']
  const [gender, setGender] = useState('')
  const [accType, setAccType] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [image, setImage] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showPassword, setShowPassword] = useState(true)




  const handleRegister = async () => {
    if (!name || !email || !password || !gender || !accType || !image) {
      showFlash(En.allFiledsRequired, 'error')
      return
    }

    // Validate email format
    if (!isEmailValid(email)) {
      showFlash(En.enterValidEmail, 'error')
      return
    }

    // Validate password strength
    if (!isStrongPassword(password)) {
      showFlash(En.passwordValidation, 'error')
      return
    }

    try {
      setLoading(true)
      const uploadResult = await uploadImage(STORAGE_FOLDERS.PROFILE_IMAGES, image); 
      const { url, filename } = uploadResult;
      const response = await signUp(name, email, password, gender, accType, url,filename)
      if (response) {
        navigation.navigate(SCREEN.LOGIN);
        showFlash('Account created! Please log in.');
      }
    } catch (error) {
      showFlash('Error while creating account', 'error');
      setLoading(false)
    } finally {
      setLoading(false);
    }


  }

  const hanldeClose = () => {
    setShowModal(false)
    setImage('')
  }


  return (
    <View style={commonStyles.container}>
      <Scrollable hasInput containerStyle={styles.innerContainer}>
        <Label animation={"zoomIn"} style={styles.welcomeText}>{En.register}</Label>

        <Pressable style={styles.profileIconPress} onPress={() => setShowModal(true)}>
          {
            image ?
              <Photo src={{ uri: image }} style={styles.photoView} />
              :
              <CustomIcon name="user-follow" family='SimpleLineIcons' size={hp(8)} color={COLOR.purple} />

          }

        </Pressable>

        <Input
          inputLabel={En.name}
          placeholder={En.enterNameHere}
          onChange={(e) => setName(e)}
          value={name}
        />

        <Input
          inputLabel={En.email}
          placeholder={En.enterEmailHere}
          onChange={(e) => setEmail(e)}
          value={email}
        />

        <RadioBtn
          options={genderOptions}
          title={'Gender'}
          selectedValue={gender}
          onSelect={setGender}
        />

        <RadioBtn
          options={accountOptions}
          title={'You are'}
          selectedValue={accType}
          onSelect={setAccType}
        />

        <Input
          inputLabel={En.password}
          placeholder={En.enterPasswordHere}
          onChange={(e) => setPassword(e)}
          value={password}
          iconName={"eye"}
          iconFamily={"Entypo"}
          iconSize={hp(3.5)}
          iconPress={() => setShowPassword((prev) => !prev)} 
          secureTextEntry={showPassword}
        />



        <Button
          style={styles.btnStyle}
          text={En.register}
          onPress={() => handleRegister()}
          isLoading={loading}
          disabled={loading}
        />

        <View style={[styles.noAccountText]}>
          <Label>{En.haveAccount}</Label>
          <Pressable onPress={() => navigation.navigate(SCREEN.LOGIN)}>
            <Label style={styles.registerText}> {En.login}</Label>
          </Pressable>
        </View>

        <ProfileModal
          visible={showModal}
          onClose={() => hanldeClose()}
          setImage={setImage}
          setShowModal={setShowModal}
        />
      </Scrollable>
    </View>
  )
}

export default RegisterScreen

const styles = StyleSheet.create({

  innerContainer: {
    justifyContent: 'center',
    flexGrow: 1,
  },
  welcomeText: {
    ...TEXT_STYLE.title,
    marginVertical: hp(2),
    textAlign: 'center',
    color: COLOR.purple
  },
  btnStyle: {
    marginTop: hp(3)
  },
  noAccountText: {
    flexDirection: 'row',
    ...commonStyles.center
  },
  registerText: {
    ...TEXT_STYLE.textSemiBold,
    color: COLOR.purple,
    paddingBottom: hp(0.5)
  },
  profileIconPress: {

  },
  photoView: {
    width: hp(12),
    height: hp(12),
    borderRadius: hp(7),
    borderWidth: 0.75,
    alignSelf: 'center'

  }
})