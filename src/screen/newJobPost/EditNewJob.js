import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { COLOR, commonStyles, TEXT_STYLE } from '../../enums/StyleGuide';
import { AppHeader, BackBtn, Button, Input, Label, Pressable } from '../../components';
import { En } from '../../locales/En';
import { FIREBASE_COLLECTIONS, KEYBOARD_TYPE, SCREEN } from '../../enums/AppEnums';
import { useSelector } from 'react-redux';
import { addDocument, saveData } from '../../services/FirebaseMethods';
import { showFlash } from '../../utils/MyUtils';


const EditNewJob = (props) => {
  const { jobDetails } = props?.route?.params
  const { navigation } = props
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [salary, setSalary] = useState('');
  const [jobLocation, setJobLocation] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [jobType, setJobType] = useState('');
  const [expType, setExpType] = useState('')
  const [loading, setLoading] = useState(false)
  const [company, setCompany] = useState('');
  const user = useSelector(({ appReducer }) => appReducer.user);

  useEffect(() => {
    if (jobDetails) {
      setJobTitle(jobDetails.jobTitle || '');
      setJobDescription(jobDetails.jobDescription || '');
      setSalary(jobDetails.salary || '');
      setJobLocation(jobDetails.jobLocation || '');
      setContactPerson(jobDetails.contactPerson || '');
      setEmail(jobDetails.contactPersonEmail || '');
      setJobType(jobDetails.jobType || '');
      setExpType(jobDetails.expType || '');
      setCompany(jobDetails.company || '');
    }
  }, [jobDetails]); // Dependency array includes jobDetails



  const handlePostJob = async () => {
    if (!jobTitle || !jobDescription || !company || !jobLocation || !contactPerson || !jobType || !expType) {
      showFlash("Please fill out all fields before posting the job.");
      return;
    }
  
    try {
      setLoading(true);
  
      // Object to hold only updated fields
      const updatedFields = {};
  
      if (jobTitle !== jobDetails.jobTitle) updatedFields.jobTitle = jobTitle;
      if (jobDescription !== jobDetails.jobDescription) updatedFields.jobDescription = jobDescription;
      if (salary !== jobDetails.salary) updatedFields.salary = salary;
      if (jobLocation !== jobDetails.jobLocation) updatedFields.jobLocation = jobLocation;
      if (contactPerson !== jobDetails.contactPerson) updatedFields.contactPerson = contactPerson;
      if (email !== jobDetails.contactPersonEmail) updatedFields.contactPersonEmail = email;
      if (expType !== jobDetails.expType) updatedFields.expType = expType;
      if (jobType !== jobDetails.jobType) updatedFields.jobType = jobType;
      if (company !== jobDetails.company) updatedFields.company = company;
  
      // If there are no updated fields, exit early
      if (Object.keys(updatedFields).length === 0) {
        showFlash("No changes detected to update.");
        setLoading(false);
        return;
      }
     
      updatedFields.update=true
      await saveData(FIREBASE_COLLECTIONS.JOBS, jobDetails?.id, updatedFields);
      
      showFlash("Job updated successfully");
      navigation.navigate(SCREEN.CAREERS);
  
      // Clear the form fields
      setJobTitle('');
      setJobDescription('');
      setSalary('');
      setJobLocation('');
      setContactPerson('');
      setEmail('');
      setJobType('');
      setExpType('');
      setCompany('');
  
    } catch (error) {
      console.log("Error updating job:", error);
      showFlash("Failed to update job. Please try again.");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleExperienceTypeChange = (type) => {
    setExpType(prevType => (prevType === type ? '' : type));
  };

  const handleJobTypeChange = (type) => {
    setJobType(prevType => (prevType === type ? '' : type));
  };

  return (
    <View style={commonStyles.container}>
      <AppHeader
        leftComp={<BackBtn />}
        title={En.editJob}
      />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        <Input
          inputLabel={"Job Title"}
          inputLabel2={"**"}
          value={jobTitle}
          onChange={setJobTitle}
          placeholder="Enter Job Title"
        />

        <Input
          inputLabel={"Company"}
          inputLabel2={"**"}
          value={company}
          onChange={setCompany}
          placeholder="Enter Company Name"
        />

        <Input
          inputLabel={"Job Description"}
          inputLabel2={"**"}
          value={jobDescription}
          onChange={setJobDescription}
          placeholder="Enter Job Description"
          multiline
          lines={4}
          style={{ height: 'auto' }}
        />

        <Input
          inputLabel={"Salary : ($)/ month"}
          value={salary}
          onChange={setSalary}
          placeholder="Enter Salary"
          keyboard={KEYBOARD_TYPE.NUMERIC}
        />

        <Input
          inputLabel={"Job Location"}
          inputLabel2={"**"}
          value={jobLocation}
          onChange={setJobLocation}
          placeholder="Enter Job Location"
        />

        <Input
          inputLabel={"Contact Person"}
          inputLabel2={"**"}
          value={contactPerson}
          onChange={setContactPerson}
          placeholder="Enter Contact Person Name"
        />

        <Input
          inputLabel={"Contact Person Email"}
          value={email}
          onChange={setEmail}
          placeholder="Enter Email Address"
          keyboard={KEYBOARD_TYPE.EMAIL}
        />

        <Label style={styles.label}>Experiance Level <Label style={styles.sterickText}>**</Label></Label>
        {['Entry Level', 'Intermediate', 'Professional'].map((type) => (
          <Pressable key={type} onPress={() => handleExperienceTypeChange(type)} style={styles.checkboxContainer}>
            <Label style={styles.checkbox}>{expType === type ? '☑️' : '☐'}</Label>
            <Label>{type}</Label>
          </Pressable>
        ))}

        <Label style={styles.label}>Job Type <Label style={styles.sterickText}>**</Label></Label>
        {['Onsite', 'Remote', 'Hybrid'].map((type) => (
          <Pressable key={type} onPress={() => handleJobTypeChange(type)} style={styles.checkboxContainer}>
            <Label style={styles.checkbox}>{jobType === type ? '☑️' : '☐'}</Label>
            <Label>{type}</Label>
          </Pressable>
        ))}

        <Button isLoading={loading} text="Post Job" onPress={handlePostJob} />
      </ScrollView>
    </View>
  );
};

export default EditNewJob;

const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: 16,
  },
  label: {
    marginBottom: 8,
    ...TEXT_STYLE.textSemiBold,
    color: COLOR.purple
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkbox: {
    marginRight: 8,
  },
  sterickText: {
    color: COLOR.red,
    fontSize: 18
  }
});
