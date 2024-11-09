import { Keyboard, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { COLOR, commonStyles, hp, TEXT_STYLE } from '../../enums/StyleGuide'
import { Button, Divider, Input, Label, Pressable, Scrollable } from '../../components'
import { En } from '../../locales/En'
import { SCREEN } from '../../enums/AppEnums'
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useDispatch } from 'react-redux'
import { login } from '../../services/FirebaseMethods'
import { setUser } from '../../redux/action/Action'
import { showFlash } from '../../utils/MyUtils'

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(true)


  const handleLogin = async () => {
    Keyboard.dismiss();
    if (email && password) {
      try {
        setLoading(true);
        const data = await login(email, password);
        if (data) {
          dispatch(setUser(data));
          showFlash(En.loginSuccessfully);
        }
      } catch (error) {
        setLoading(false);
        showFlash(error?.message || 'Login failed', 'error');
      } finally {
        setLoading(false);
      }
    } else {
      showFlash(En.ensureEnterAllFields, "error");
    }
  };


  return (
    <View style={commonStyles.container}>
      <Scrollable hasInput containerStyle={styles.innerContainer}>

        {/* <Label style={styles.logo}>LOGO</Label> */}
        <Label animation={"zoomIn"} style={styles.welcomeText}>{En.welcomeBack}</Label>

        <Input
          inputLabel={En.email}
          placeholder={En.enterEmailHere}
          onChange={(e) => setEmail(e)}
          value={email}
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
          text={En.login}
          onPress={() => handleLogin()}
          isLoading={loading}
        />


        <Divider text={En.or} />

        {/* <Button
          text={En.continueGoogle} 
        /> */}

        <View style={[styles.noAccountText]}>
          <Label>{En.noAccount}</Label>
          <Pressable onPress={() => navigation.navigate(SCREEN.REGISTER)}>
            <Label style={styles.registerText}> {En.register}</Label>
          </Pressable>
        </View>

      </Scrollable>
    </View>
  )
}

export default LoginScreen

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
  logo: {
    textAlign: 'center'
  },
  btnStyle: {
    marginTop: hp(4)
  },
  noAccountText: {
    flexDirection: 'row',
    ...commonStyles.center
  },
  registerText: {
    ...TEXT_STYLE.textSemiBold,
    color: COLOR.purple,
    paddingBottom: hp(0.5)
  }

})