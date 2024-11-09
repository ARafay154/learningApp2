import { StyleSheet, Text, View, Modal, Pressable } from 'react-native';
import React, { memo, useState } from 'react';
import { Loader } from '../reuseables';
import { COLOR } from '../../enums/StyleGuide';

const ApplyJobModal = ({ visible, onClose, jobTitle, onApply, loading,uploadCV }) => {

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.headerText}>Applied For</Text>
          <Text style={styles.jobTitle}>{jobTitle}</Text>

          <Pressable style={styles.uploadButton} onPress={()=>uploadCV()}>
            <Text style={styles.uploadButtonText}>Upload CV</Text>
          </Pressable>

          <View style={styles.buttonContainer}>
            <Pressable style={[styles.button, styles.cancelButton]} onPress={onClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </Pressable>
            <Pressable style={[styles.button, styles.applyButton]} onPress={onApply}>
              {
                loading ?
                  <Loader size='small' style={{marginVertical:0}} color={COLOR.white}/>
                  :
                  <Text style={styles.buttonText}>Apply</Text>
              }

            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default memo(ApplyJobModal);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A4A4A',
    marginBottom: 10,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
  },
  uploadButton: {
    backgroundColor: '#6A5ACD',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  uploadButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#D9534F', // Red color for cancel button
  },
  applyButton: {
    backgroundColor: '#5CB85C', // Green color for apply button
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
  },
});
