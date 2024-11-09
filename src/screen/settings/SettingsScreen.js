import { StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { COLOR, commonStyles, hp, TEXT_STYLE, wp } from '../../enums/StyleGuide';
import { AppHeader, BackBtn, CustomDrawer, Label, Loader, OpenDrawer, Pressable } from '../../components';
import { En } from '../../locales/En';
import { SETTING_CARDS } from '../../assets/data/DummyData';
import { signOut } from '../../services/FirebaseMethods';
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/action/Action';
import { showFlash } from '../../utils/MyUtils';

const SettingsScreen = ({ navigation }) => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [openDrawer, setOpenDrawer] = useState('');

  const handleLogout = async () => {
    try {
      setLoading(true)
      await signOut()
      dispatch(setUser(null));
      showFlash("Logout Successfully")
    } catch (error) {
      console.log("Error while logout", error)
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }
  return (
    <View style={commonStyles.container}>
      <AppHeader
       leftComp={<OpenDrawer setOpen={() => setOpenDrawer(true)} />}
        title={En.settings}
        style={styles.headerStyle}
      />

      {SETTING_CARDS.map((item, index) => (
        <Pressable
          key={index}
          animation="slideInDown" // Changed to slideInDown for top entrance
          delay={index * 300} // Increased delay for a more pronounced staggered effect
          style={styles.card}
          onPress={() => navigation.navigate(item.route)}
        >
          <Label style={styles.cardText}>{item.text}</Label>
        </Pressable>
      ))}

      <Pressable
        animation="slideInDown" // Changed to slideInDown for top entrance
        style={styles.card}
        onPress={handleLogout}
      >
        {
          loading ?
            <Loader />
            :
            <Label style={styles.cardText}>{"Logout"}</Label>
        }

      </Pressable>

      <CustomDrawer isVisible={openDrawer} onClose={() => setOpenDrawer(false)} />
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  card: {
    height: hp(8),
    marginVertical: hp(1.5),
    borderRadius: hp(1),
    backgroundColor: COLOR.white,
    borderColor: COLOR.purple,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp(4),
    // Shadow for elevation
    shadowColor: COLOR.purple,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // Adds shadow on Android
  },
  cardText: {
    ...TEXT_STYLE.textSemiBold
  },
  headerStyle: {
    marginBottom: hp(1),
  },
});
