import React, { useEffect, useState } from 'react';
import { Modal, StyleSheet, View, SafeAreaView, TouchableWithoutFeedback, } from 'react-native';
import { COLOR, hp, TEXT_STYLE, WIDTH, wp } from '../../enums/StyleGuide';
import { useDispatch, useSelector } from 'react-redux';
import { CustomIcon, Label, Loader, Photo, Pressable } from '../reuseables';
import { DRAWER_NAVIGATION_DATA } from '../../assets/data/DummyData'; // Ensure this path is correct
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { signOut } from '../../services/FirebaseMethods';
import { setUser } from '../../redux/action/Action';
import { showFlash } from '../../utils/MyUtils';

const CustomDrawer = ({ isVisible, onClose }) => {
  const user = useSelector(({ appReducer }) => appReducer.user);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const dispatch = useDispatch()

  useEffect(() => {
    const currentRouteName = navigation.getState().routes[navigation.getState().index].name;
    const index = DRAWER_NAVIGATION_DATA.findIndex(item => item.route === currentRouteName);
    if (index !== -1) {
      setSelectedIndex(index);
    }
  }, [isFocused, navigation]);

  const handleOverlayPress = () => {
    onClose();
  };

  const handleNavigation = (tabData, index) => {
    setLoading(true);
    setSelectedIndex(index);

    setTimeout(() => {
      onClose();
      setLoading(false);
    }, 150);

    navigation.navigate(tabData?.route);
  };

  const logout = async()=>{
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
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <SafeAreaView />
      <TouchableWithoutFeedback onPress={handleOverlayPress}>
        <View style={styles.overlay}>
          <View style={styles.drawerContainer}>
            <Photo url={user?.profileImage?.url} style={styles.userProfile} />
            <Label style={styles.userName}>{user?.name}</Label>
            <Label style={styles.userEmail}>{user?.email}</Label>

            <View style={{ marginTop: hp(2) }}>
              {loading ? (
                <Loader style={{ alignSelf: 'center', marginTop: hp(6) }} />
              ) : (
                DRAWER_NAVIGATION_DATA.map((item, index) => (
                  <Pressable
                    key={index}
                    style={selectedIndex === index ? styles.itemViewSelected : styles.itemView}
                    onPress={() => handleNavigation(item, index)}
                    animation="pulse"
                    delay={index * 100}
                  >
                    <CustomIcon
                      name={item.iconName}
                      family={item.family}
                      color={selectedIndex === index ? COLOR.white : COLOR.purple}
                      size={hp(3.5)}
                    />
                    <Label
                      style={selectedIndex === index ? styles.drawerLabelSelected : styles.drawerLabel}
                    >
                      {item.title}
                    </Label>
                  </Pressable>
                ))
              )}

              <Pressable
                style={styles.logoutTab}
                animation="pulse"
                onPress={()=>logout()}
              >
                <CustomIcon
                  name={"logout"}
                  family={"MaterialCommunityIcons"}
                  color={COLOR.white}
                  size={hp(3.5)}
                />
                <Label
                  style={styles.drawerLabelSelected}
                >
                  logout
                </Label>
              </Pressable>
            </View>



          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default CustomDrawer;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  drawerContainer: {
    width: WIDTH * 0.7,
    height: '100%',
    backgroundColor: COLOR.white,
    padding: 20,
    borderTopRightRadius: hp(2),
    borderBottomRightRadius: hp(2),
    elevation: 5,
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  userProfile: {
    width: hp(10),
    height: hp(10),
    borderRadius: hp(10),
    alignSelf: 'center',
    marginVertical: hp(2),
    borderWidth: 0.5,
    borderColor: COLOR.light_grey2
  },
  userName: {
    ...TEXT_STYLE.bigTextBold,
    color: COLOR.purple,
    textAlign: 'center',
  },
  userEmail: {
    ...TEXT_STYLE.textSemiBold,
    color: COLOR.purple,
    textAlign: 'center',
  },
  itemView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(1),
    paddingHorizontal: wp(2),
    width: "80%",
    alignSelf: 'center',
    backgroundColor: COLOR.white,
    borderRadius: hp(1),
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
    marginVertical: hp(0.75),
  },
  itemViewSelected: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(1),
    paddingHorizontal: wp(2),
    width: "80%",
    alignSelf: 'center',
    backgroundColor: COLOR.purple,
    borderRadius: hp(1),
    shadowColor: COLOR.lightPurple,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
    marginVertical: hp(0.75),
  },
  logoutTab:{
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(1),
    paddingHorizontal: wp(2),
    width: "80%",
    alignSelf: 'center',
    backgroundColor: COLOR.red,
    borderRadius: hp(1),
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
    marginVertical: hp(0.75),
  },
  drawerLabel: {
    ...TEXT_STYLE.smallTextBold,
    color: COLOR.purple,
    marginLeft: wp(4),
  },
  drawerLabelSelected: {
    ...TEXT_STYLE.smallTextBold,
    color: COLOR.white,
    marginLeft: wp(4),
  },
});
