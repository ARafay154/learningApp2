import { Keyboard, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { COLOR, commonStyles, hp, TEXT_STYLE } from '../../enums/StyleGuide'
import { AppHeader, BackBtn, Button, Divider, Input, Label, Pressable, Scrollable } from '../../components'
import { En } from '../../locales/En'
import { showFlash } from '../../utils/MyUtils'

const ContactUsScreen = ({navigation}) => {


  const handleSend = ()=>{
    Keyboard.dismiss()
    showFlash("Query send.")
    navigation.goBack()
  }

  return (
    <View style={commonStyles.container}>
      <AppHeader
        leftComp={<BackBtn />}
        title={En.contactUs}
        style={styles.headerStyle}
      />

      <Label style={styles.contactUsHeadingText}>{En.contactUsHeadingText}</Label>
      <Scrollable hasInput>

        <Input
          inputLabel={En.name}
          placeholder={En.writeHere}
        />

        <Input
          inputLabel={En.email}
          placeholder={En.writeHere}
        />


        <Input
          inputLabel={En.subject}
          placeholder={En.writeHere}
        />

        <Input
          multiline
          inputLabel={En.details}
          style={styles.inputStyle}
          placeholder={En.writeHere}
        />

        <Button
          style={styles.btnStyle}
          text={En.send} 
          onPress={handleSend}/>

      </Scrollable>

      {/* <Divider style={styles.dividerStyle} text={En.or} />

      <Pressable>
        <Label style={styles.chatWithCC}>{En.chatWithCC}</Label>
      </Pressable> */}


    </View>
  )
}

export default ContactUsScreen

const styles = StyleSheet.create({
  btnStyle: {
    marginTop: hp(4)
  },
  headerStyle: {
    marginBottom: hp(4)
  },
  chatWithCC: {
    ...TEXT_STYLE.textSemiBold,
    color: COLOR.purple,
    textAlign: 'center',

  },
  dividerStyle: {
    marginVertical: hp(4)
  },
  inputStyle: {
    height: hp(15),
    textAlignVertical: 'top',
    borderWidth: 2,
    marginTop: hp(0.5),
    borderRadius: hp(0.75)
  },
  contactUsHeadingText: {
    ...TEXT_STYLE.textMedium,
    marginBottom: hp(2)
  }
})