import { StyleSheet, Text, View, Modal, } from 'react-native';
import React, { memo, useState } from 'react';
import { Button, CustomIcon, Input, Label, Pressable } from '../reuseables';
import { hp } from '../../enums/StyleGuide';
import { showFlash } from '../../utils/MyUtils';
import { saveData } from '../../services/FirebaseMethods';
import { FIREBASE_COLLECTIONS } from '../../enums/AppEnums';
import { useNavigation } from '@react-navigation/native';

const LectureEdit = ({ data, visible, notVisible,  }) => {
  const [title, setTitle] = useState(data.title); 
const [loading, setLoading] = useState(false)
const navigation= useNavigation()



  const handleSave = async() => {
    if (title === data.title) {
     showFlash("No change found")
      onClose(); 
      return;
    }

    try {
      setLoading(true)
      const updateData = {
        title:title
      }
      await saveData(FIREBASE_COLLECTIONS.ONLINE_LECTURES,data?.documentId,updateData)
      showFlash("Update Successfully!")
      onClose(); 
    } catch (error) {
      showFlash("Something going wrong!")
      setLoading(false)
    } finally {
      setLoading(false)
    }
  };

  const onClose = ()=>{
    notVisible(false)
    navigation.goBack()
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Pressable style={styles.closeIcon} onPress={()=>notVisible(false)}>
            <CustomIcon name={"close-box-outline"} family='MaterialCommunityIcons' size={hp(4)}/>
          </Pressable>
          <Label style={styles.title}>Edit Lecture Title</Label>
          <Input
            value={title}
            onChange={setTitle}
            placeholder="Enter new title"
          />

          <Button isLoading={loading}  text={"Save"} onPress={handleSave}/>
         
        </View>
      </View>
    </Modal>
  );
};

export default memo(LectureEdit);

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  closeIcon:{
    alignSelf:'flex-end',
    marginBottom:hp(1)
  }
});
