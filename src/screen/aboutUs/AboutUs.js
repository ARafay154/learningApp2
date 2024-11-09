import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { COLOR, commonStyles, hp, TEXT_STYLE } from '../../enums/StyleGuide'
import { AppHeader, BackBtn, CustomDrawer, Label, OpenDrawer, Scrollable } from '../../components'
import { En } from '../../locales/En'

const AboutUs = () => {
  const [openDrawer, setOpenDrawer] = useState('');
  return (
    <View style={commonStyles.container}>
      <AppHeader
        leftComp={<OpenDrawer setOpen={() => setOpenDrawer(true)} />}
        title={En.aboutUs}
      />

      <Scrollable containerStyle={styles.innerContainer}>
        <Label animation="fadeInUp" style={styles.introText} duration={800} delay={200}>
          {En.aboutUsIntroPara}
        </Label>

        <Label animation="fadeInLeft" style={styles.sectionHeader} duration={800} delay={400}>
          {En.onlineCourses}
        </Label>
        <Label animation="fadeInRight" style={styles.sectionText} duration={700} delay={500}>
          {En.onlineCourseSubText}
        </Label>

        <Label animation="fadeInLeft" style={styles.sectionHeader} duration={800} delay={600}>
          {En.offlineCourses}
        </Label>
        <Label animation="fadeInRight" style={styles.sectionText} duration={700} delay={700}>
          {En.offlineCourseSubText}
        </Label>

        <Label animation="fadeInLeft" style={styles.sectionHeader} duration={800} delay={800}>
          {En.chatWithInstructor}
        </Label>
        <Label animation="fadeInRight" style={styles.sectionText} duration={700} delay={900}>
          {En.chatWithInstructorSubText}
        </Label>

        <Label animation="fadeInLeft" style={styles.sectionHeader} duration={800} delay={1000}>
          {En.careerOpportunities}
        </Label>
        <Label animation="fadeInRight" style={styles.sectionText} duration={700} delay={1100}>
          {En.careerOpportunitiesSubText}
        </Label>

        <Label animation="fadeInUp" style={styles.endingText} duration={800} delay={1200}>
          {En.endingPara}
        </Label>
        <CustomDrawer isVisible={openDrawer} onClose={() => setOpenDrawer(false)} />
      </Scrollable>


    </View>
  )
}

export default AboutUs

const styles = StyleSheet.create({
  introText: {
    ...TEXT_STYLE.textMedium,
    color: COLOR.black,
    marginBottom: 10,
    textAlign: 'justify',
    lineHeight: hp(3.5),
  },
  sectionHeader: {
    ...TEXT_STYLE.bigTextSemiBold,
    color: COLOR.purple,
    marginTop: 15,
    marginBottom: 5,
  },
  sectionText: {
    color: COLOR.black,
    marginBottom: 10,
    ...TEXT_STYLE.textMedium,
    lineHeight: hp(3.5),

  },
  endingText: {
    color: COLOR.black,
    textAlign: 'justify',
    marginTop: 15,
    ...TEXT_STYLE.textMedium,
    lineHeight: hp(3.5),
  },
  innerContainer: {
    paddingVertical: hp(2)
  }
})
