import { FlatList, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { COLOR, commonStyles, hp, TEXT_STYLE, wp } from '../../enums/StyleGuide';
import { AppHeader, CustomDrawer, CustomIcon, Label, OpenDrawer, Photo, Pressable } from '../../components';
import { En } from '../../locales/En';
import { HOMECARDs } from '../../assets/data/DummyData';
import * as Animatable from 'react-native-animatable';
import { useSelector } from 'react-redux';

const HomeScreen = ({ navigation }) => {
  const [openDrawer, setOpenDrawer] = useState('');
  const cardIconSize = hp(6);
  const user = useSelector(({ appReducer }) => appReducer.user);

  return (
    <View style={commonStyles.container}>
      <AppHeader
         leftComp={<OpenDrawer setOpen={() => setOpenDrawer(true)} />}
        rightComp={
          <Pressable>
            {
              user?.profileImage ?
                <Photo url={user?.profileImage?.url} style={styles.profileImage} />
                :
                <CustomIcon name="circle-user" family='FontAwesome6' />
            }
          </Pressable>
        }
        style={{ height: hp(6), paddingRight: wp(2), marginBottom :hp(2) }}
      />
  
        <FlatList
          data={HOMECARDs}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <Animatable.View
              animation="fadeInUpBig"
              duration={1000}
              delay={index * 300}
              key={index}
              style={styles.cardView}
            >
              <View style={styles.iconContainer}>
                <CustomIcon name={item?.icon} family={item?.family} size={cardIconSize} style={styles.cardIcon} />
              </View>
              <Pressable style={styles.cardPress} onPress={() => navigation.navigate(item?.route)}>
                <Label style={styles.cardLabel}>{item?.text}</Label>
              </Pressable>
            </Animatable.View>
          )}
          numColumns={2} // For two items per row
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.flatListContainer}
        />
     
     <CustomDrawer isVisible={openDrawer} onClose={() => setOpenDrawer(false)} />

    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  headerLogo: {
    ...TEXT_STYLE.title,
    color: COLOR.purple,
    width: "80%",
  },
  flatListContainer: {
    paddingHorizontal: wp(2),
    paddingBottom: hp(2),
  },
  cardView: {
    width: '48%', // 48% to account for margins and spacing
    borderWidth: 1,
    marginHorizontal: wp(1),
    marginVertical: wp(2),
    borderRadius: hp(1),
    borderColor: COLOR.purple,
    backgroundColor: COLOR.white,
    alignItems: 'center',
    shadowColor: COLOR.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 1,
    height: hp(24),
  },
  iconContainer: {
    height: '60%', // 70% of the card height
    justifyContent: 'center', // Center the icon vertically
    alignItems: 'center', // Center the icon horizontally
  },
  cardIcon: {
    marginVertical: hp(2),
  },
  cardPress: {
    backgroundColor: COLOR.purple,
    width: '100%',
    height: '30%', // 30% of the card height
    justifyContent: 'center', // Center the label vertically
    borderBottomLeftRadius: hp(0.75),
    borderBottomRightRadius: hp(0.75),
  },
  cardLabel: {
    ...TEXT_STYLE.bigTextSemiBold,
    color: COLOR.white,
    textAlign: 'center',
  },
  profileImage: {
    width: hp(6),
    height: hp(6),
    borderRadius: hp(6),
    borderWidth: 0.5,
    borderColor: COLOR.light_grey2,
  }
});