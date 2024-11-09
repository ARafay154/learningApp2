import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { COLOR, commonStyles, TEXT_STYLE } from '../../enums/StyleGuide'
import { Label } from '../../components'
import { En } from '../../locales/En'
import { SCREEN } from '../../enums/AppEnums'


const SplashScreen = ({ navigation }) => {

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace(SCREEN.LOGIN);
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigation]);


  return (
    <View style={styles.container}>
      <Label animation={"zoomIn"} style={styles.logo}>{En.splashLogo}</Label>
    </View>
  )
}

export default SplashScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.white,
    ...commonStyles.center
  },
  logo: {
    ...TEXT_STYLE.title,
    letterSpacing: 8,
    color: COLOR.purple
  }
})