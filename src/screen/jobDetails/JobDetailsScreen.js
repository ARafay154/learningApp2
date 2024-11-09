import { StyleSheet, Text, View, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { COLOR, commonStyles, hp, TEXT_STYLE } from '../../enums/StyleGuide';
import { AppHeader, ApplyJobModal, BackBtn, Button, Label, Pressable } from '../../components';
import { En } from '../../locales/En';
import { ACC_TYPE, FIREBASE_COLLECTIONS, SCREEN, STORAGE_FOLDERS } from '../../enums/AppEnums';
import { formatDate, formatDate2, showFlash } from '../../utils/MyUtils';
import { addDocument, saveData, uploadImage } from '../../services/FirebaseMethods';
import DocumentPicker from 'react-native-document-picker';

const JobDetailsScreen = (props) => {
    const { navigation } = props;
    const { jobDetails } = props?.route?.params;
    const user = useSelector(({ appReducer }) => appReducer.user);
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setloading] = useState(false)
    const [resume, setResume] = useState('')


    const handleDocument = async () => {
        try {
            const result = await DocumentPicker.pickSingle({
                type: [DocumentPicker.types.pdf],
                copyTo: "cachesDirectory",
            });
            // console.log(result)
            if (result) {
                setResume(result)
            } else {
                setResume('')
            }
        } catch (error) {
            if (DocumentPicker.isCancel(error)) {
                // console.log('User cancelled the document picker');
            } else {
                // console.log('DocumentPicker error:', error);
            }
        }
    };


    const handleApply = async () => {
        if(!resume){
            showFlash("upload resume first!")
            return;
        }

        const appliedUsers = jobDetails?.appliedUsers || [];
        if (!appliedUsers.includes(user?.uid)) {
            const updatedAppliedUsers = [...appliedUsers, user?.uid];
            try {
                setloading(true)
                const uploadResult = await uploadImage(STORAGE_FOLDERS.RESUMES, resume); 
                const { url, filename } = uploadResult;
                const jobApplyData = {
                    resume:{
                        url:url,
                        filename:filename
                    },
                    createdBy:user?.uid,
                    jobId:jobDetails?.id,
                }
                await addDocument(FIREBASE_COLLECTIONS.JOB_APPLIED, jobApplyData)
                await saveData(FIREBASE_COLLECTIONS.JOBS, jobDetails?.id, { appliedUsers: updatedAppliedUsers })
                showFlash('Successfully applied for the job!');
                setModalVisible(false);
                setResume('')
                navigation.goBack()
            } catch (error) {
                console.log('Error applying for the job: ', error);
                showFlash("Some went wrong. try again later! ")
                setloading(false)
                setModalVisible(false);
            }
        }
    };

    const handleClose = ()=>{
     setResume('')
        setModalVisible(false)
    }

    return (
        <View style={commonStyles.container}>
            <AppHeader
                leftComp={<BackBtn />}
                title={En.careers}
                style={{ marginBottom: hp(2) }}
                rightComp={
                    user?.accType === ACC_TYPE.TEACHER ? (
                        <Pressable onPress={() => navigation.navigate(SCREEN.EDIT_JOB, { jobDetails: jobDetails })}>
                            <Label style={styles.addJobText}>Edit</Label>
                        </Pressable>
                    ) : null
                }
            />
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.card}>
                    <Label style={styles.jobTitle}>{jobDetails?.jobTitle}</Label>
                    <Label style={styles.company}>{jobDetails?.company}</Label>
                    <Label style={styles.location}>{jobDetails?.jobLocation}</Label>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Job Description</Text>
                        <Text style={styles.description}>{jobDetails?.jobDescription}</Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Job Details</Text>
                        <View style={styles.detailContainer}>
                            <Text style={styles.detailItem}>Type: {jobDetails?.jobType}</Text>
                            <Text style={styles.detailItem}>Experience: {jobDetails?.expType}</Text>
                            <Text style={styles.detailItem}>Posted On: {formatDate2(jobDetails?.createdAt)}</Text>
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Contact Information</Text>
                        <View style={styles.detailContainer}>
                            <Text style={styles.detailItem}>Contact Person: {jobDetails?.contactPerson}</Text>
                            <Text style={styles.detailItem}>Email: {jobDetails?.contactPersonEmail}</Text>
                        </View>
                    </View>
                </View>
                {
                    user?.accType === ACC_TYPE.STUDENT ?
                        (
                            !jobDetails?.appliedUsers?.includes(user?.uid)
                                ?
                                <Button text={"Apply"} style={{ marginVertical: hp(2) }} onPress={() => setModalVisible(true)} />
                                :
                                <Label style={styles.alreadyAppliedText}>Already applied</Label>
                        )

                        :
                        null
                }


            </ScrollView>
            <ApplyJobModal
                visible={modalVisible}
                onClose={handleClose}
                jobTitle={jobDetails?.jobTitle}
                onApply={handleApply}
                loading={loading}
                uploadCV = {handleDocument}
            />
        </View>
    );
};

export default JobDetailsScreen;

const styles = StyleSheet.create({
    addJobText: {
        ...TEXT_STYLE.smallTextSemiBold,
        backgroundColor: COLOR.purple,
        color: COLOR.white,
        paddingVertical: hp(0.5),
        paddingHorizontal: hp(1),
        borderRadius: hp(0.5),
    },
    content: {
        padding: 16,
        backgroundColor: COLOR.lightGray, // Adding background color for contrast
    },
    card: {
        backgroundColor: COLOR.white,
        padding: 20,
        borderRadius: 15,
        shadowColor: COLOR.purple,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 5,
        marginBottom: 20,
    },
    jobTitle: {
        ...TEXT_STYLE.bigTextBold,
        color: COLOR.purple,

    },
    company: {
        ...TEXT_STYLE.textSemiBold,
        color: COLOR.purple,
        marginBottom: 4,
    },
    location: {
        ...TEXT_STYLE.textMedium,
        color: COLOR.purple,
        marginBottom: 12,
    },
    section: {
        marginVertical: 8,
    },
    sectionTitle: {
        ...TEXT_STYLE.textBold,
        color: COLOR.purple,
        marginBottom: 2,
        borderBottomWidth: 1,
        borderBottomColor: COLOR.lightPurple,
        paddingBottom: 4,
    },
    description: {
        ...TEXT_STYLE.textMedium,
        marginVertical: 8,
        lineHeight: 20,
    },
    detailContainer: {

        borderRadius: 10,
        padding: 10,
        marginVertical: 8,
    },
    detailItem: {
        ...TEXT_STYLE.textMedium,
        marginVertical: 2
    },
    alreadyAppliedText: {
        marginVertical: hp(2),
        ...TEXT_STYLE.smallTextBold,
        color: COLOR.purple,
        textAlign: 'center'
    }
});
