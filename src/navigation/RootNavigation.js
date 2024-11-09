import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FIREBASE_COLLECTIONS, SCREEN } from '../enums/AppEnums';
import * as ui from '../screen';
import { useDispatch, useSelector } from 'react-redux';
import { getDocumentData, signOut } from '../services/FirebaseMethods';
import { setUser } from '../redux/action/Action';
import auth from '@react-native-firebase/auth'


const RootNavigation = () => {
    const user = useSelector(({ appReducer }) => appReducer.user);
    const dispatch = useDispatch()

    const Stack = createNativeStackNavigator();

    const getActiveUser = async () => {
        const userActive = auth().currentUser;
        if (userActive?.uid) {
            const data = await getDocumentData(FIREBASE_COLLECTIONS.USERS, userActive?.uid)
            if (data) {
                dispatch(setUser(data)); // Update Redux store with user data
            } else {
                dispatch(setUser(null));
            }
        }
    }

    useEffect(() => {
        getActiveUser()
    }, [])

    
    
    


    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {
                    !user ?
                        <>
                            <Stack.Screen name={SCREEN.SPLASH} component={ui.SplashScreen} />
                            <Stack.Screen name={SCREEN.LOGIN} component={ui.LoginScreen} />
                            <Stack.Screen name={SCREEN.REGISTER} component={ui.RegisterScreen} />
                        </>
                        :
                        <>
                             
                             <Stack.Screen name={SCREEN.HOME} component={ui.HomeScreen} />
                            <Stack.Screen name={SCREEN.ABOUTUS} component={ui.AboutUs} />
                            <Stack.Screen name={SCREEN.ONLINE_COURSES} component={ui.OnlineCoursesScreen} />
                            <Stack.Screen name={SCREEN.OFFLINE_COURSES} component={ui.OfflineCoursesScreen} />
                            <Stack.Screen name={SCREEN.CHAT} component={ui.ChatScreen} />
                            <Stack.Screen name={SCREEN.INBOX} component={ui.InboxScreen} />
                            <Stack.Screen name={SCREEN.SETTINGS} component={ui.SettingsScreen} />
                            <Stack.Screen name={SCREEN.CAREERS} component={ui.CareersScreen} />
                            <Stack.Screen name={SCREEN.CONTACTUS} component={ui.ContactUsScreen} />
                            <Stack.Screen name={SCREEN.EDIT_PROFILE} component={ui.EditProfileScreen} />
                            <Stack.Screen name={SCREEN.COURSE_UPLOAD} component={ui.CourseuploadScreen} />
                            <Stack.Screen name={SCREEN.SPECIFIC_CAT_COURSE} component={ui.SpecificCategoryCourseScreen} />
                            <Stack.Screen name={SCREEN.NEW_COURSE} component={ui.NewCourseScreen} />
                            <Stack.Screen name={SCREEN.VIDEO_SCREEN} component={ui.VideoScreen} />
                            <Stack.Screen name={SCREEN.ADD_QUIZ} component={ui.AddQuizScreen} />
                            <Stack.Screen name={SCREEN.QUIZ_ATTEMPT} component={ui.QuizAttemptScreen} />
                            <Stack.Screen name={SCREEN.POST_NEWJOB} component={ui.PostNewJob} />
                            <Stack.Screen name={SCREEN.JOB_DETAILS} component={ui.JobDetailsScreen} />
                            <Stack.Screen name={SCREEN.EDIT_JOB} component={ui.EditNewJob} />
                            <Stack.Screen name={SCREEN.PROGRESS} component={ui.ProgressScreen} />
                            <Stack.Screen name={SCREEN.STUDENTS_PROGRESS} component={ui.StudentsProgressScreen} />
                            <Stack.Screen name={SCREEN.SINGLE_STUDENT_PROGRESS} component={ui.SingleStudentProgressScreen} />
                            <Stack.Screen name={SCREEN.PAYMENT_SCREEN} component={ui.PaymentScreen} />
                            
                        </>
                }




            </Stack.Navigator>
        </NavigationContainer>

    )
}

export default RootNavigation

const styles = StyleSheet.create({})