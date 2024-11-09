import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { COLOR, commonStyles, hp, TEXT_STYLE, wp } from '../../enums/StyleGuide'
import { AppHeader, BackBtn, CustomDrawer, EmptyContainer, Label, OpenDrawer, Pressable } from '../../components'
import { En } from '../../locales/En'
import { useSelector } from 'react-redux'
import { ACC_TYPE, FIREBASE_COLLECTIONS, SCREEN } from '../../enums/AppEnums'
import firestore from '@react-native-firebase/firestore'
import { formatDate, formatDate2 } from '../../utils/MyUtils'


const CareersScreen = ({ navigation }) => {
  const user = useSelector(({ appReducer }) => appReducer.user);
  const [jobs, setJobs] = useState([])
  const [openDrawer, setOpenDrawer] = useState('');

  useEffect(() => {
    const unsubscribe = firestore()
      .collection(FIREBASE_COLLECTIONS.JOBS)
      .orderBy('createdAt', 'desc')
      .onSnapshot(
        querySnapshot => {
          if (!querySnapshot) {
            console.error("Query snapshot is null.");
            setJobs([]);
            return;
          }

          if (querySnapshot.empty) {
            console.log("No jobs found.");
            setJobs([]);
            return;
          }

          const jobData = querySnapshot.docs.map(doc => ({
            id: doc.id, // Include document ID
            ...doc.data()
          }));

          if (user?.accType === ACC_TYPE.TEACHER) {
            const adminJobsData = jobData.filter(job => job?.createdBy === user?.uid);
            setJobs(adminJobsData);
          } else {
            setJobs(jobData);
          }
        },
        error => {
          console.error("Error fetching jobs: ", error);
        }
      );

    return () => unsubscribe();
  }, [user?.accType]);


  return (
    <View style={commonStyles.container}>
      <AppHeader
         leftComp={<OpenDrawer setOpen={() => setOpenDrawer(true)} />}
        title={En.careers}
        style={{ marginBottom: hp(2) }}
        rightComp={
          user?.accType === ACC_TYPE.TEACHER ?
            <Pressable onPress={() => navigation.navigate(SCREEN.POST_NEWJOB)}>
              <Label style={styles.addJobText}>Post New Job</Label>
            </Pressable>
            : null
        }
      />

      <FlatList
        data={jobs}

        ListEmptyComponent={<EmptyContainer text={"Currently no jobs available"} />}
        renderItem={({ item, index }) => (
          <Pressable
            animation="slideInDown" // Changed to slideInDown for top entrance
            delay={item.index * 500}
            key={index}
            style={styles.cardContainer}
            onPress={() => navigation.navigate(SCREEN.JOB_DETAILS, { jobDetails: item })}
          >
            {item?.update && <Label style={styles.updateText}>updated</Label>}
            <Label style={styles.title}>{item?.jobTitle}</Label>
            <Label style={styles.company}>{item?.company}</Label>
            <View style={styles.infoRow}>
              <Label style={styles.location}>{item?.jobLocation}</Label>
              <Label style={styles.date}>{formatDate2(item?.createdAt)}</Label>
            </View>
            {
              item?.appliedUsers?.includes(user?.uid) &&
              <Label style={styles.appliedText}>Applied</Label>
            }
          </Pressable>
        )}
      />

<CustomDrawer isVisible={openDrawer} onClose={() => setOpenDrawer(false)} />
    </View>
  )
}

export default CareersScreen

const styles = StyleSheet.create({
  addJobText: {
    ...TEXT_STYLE.smallTextSemiBold,
    backgroundColor: COLOR.purple,
    color: COLOR.white,
    paddingVertical: hp(0.5),
    paddingHorizontal: hp(1),
    borderRadius: hp(0.5),
  },
  cardContainer: {
    backgroundColor: COLOR.white,
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
    borderLeftWidth: 8,
    borderLeftColor: COLOR.purple,
    marginHorizontal: wp(1)
  },
  title: {
    ...TEXT_STYLE.bigTextBold,
    color: COLOR.purple,

  },
  company: {
    ...TEXT_STYLE.textSemiBold,
    color: COLOR.purple,
    marginVertical: hp(0.5)
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  location: {
    ...TEXT_STYLE.textSemiBold,
    color: COLOR.purple,
  },
  date: {
    ...TEXT_STYLE.smallTextSemiBold,
    color: COLOR.gray,
  },
  appliedText: {
    ...TEXT_STYLE.smallTextBold,
    color: COLOR.red,
    textAlign: 'left',
    marginTop: hp(1)
  },
  updateText:{
    ...TEXT_STYLE.smallTextMedium,
    color: COLOR.red,
    textAlign: 'right',
  }
});
