import { StyleSheet, Text, View, Modal, Pressable } from 'react-native';
import React, { memo } from 'react';
import { Label, Loader } from '../reuseables';
import { COLOR, commonStyles, hp, TEXT_STYLE, wp } from '../../enums/StyleGuide';

const ConfirmationModal = ({ visible, onClose, courseTitle, onApply, loading, confirmation }) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <Label style={styles.headerText}>Confirmation</Label>
                    {
                        confirmation === 'end' ?
                            <Label style={styles.subheaderText}>Are you complete this lecture? </Label>
                            :
                            <Label style={styles.subheaderText}>Are you sure you want to start <Label style={styles.jobTitle}>{courseTitle}</Label> course?</Label>
                    }



                    {
                        confirmation === 'end' ?
                            <View style={styles.buttonContainer}>
                                <Pressable style={[styles.button, styles.cancelButton]} onPress={onClose}>
                                    <Label style={styles.buttonText}>No</Label>
                                </Pressable>
                                <Pressable style={[styles.button, styles.applyButton]} onPress={onApply}>
                                    {
                                        loading ?
                                            <Loader size='small' style={{ marginVertical: 0 }} color={COLOR.white} />
                                            :
                                            <Label style={styles.buttonText}>Yes</Label>
                                    }

                                </Pressable>
                            </View>
                            :
                            <View style={styles.buttonContainer}>
                                <Pressable style={[styles.button, styles.cancelButton]} onPress={onClose}>
                                    <Label style={styles.buttonText}>Cancel</Label>
                                </Pressable>
                                <Pressable style={[styles.button, styles.applyButton]} onPress={onApply}>
                                    {
                                        loading ?
                                            <Loader size='small' style={{ marginVertical: 0 }} color={COLOR.white} />
                                            :
                                            <Label style={styles.buttonText}>Start</Label>
                                    }

                                </Pressable>
                            </View>
                    }



                </View>
            </View>
        </Modal>
    );
};

export default memo(ConfirmationModal);

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
        ...TEXT_STYLE.smallTitleBold,
        color: COLOR.purple,
        marginBottom: 10,
    },
    subheaderText: {
        marginVertical: hp(4),
        lineHeight: hp(3),
        textAlign: 'justify'
    },
    jobTitle: {
        ...TEXT_STYLE.textSemiBold,
        color: COLOR.purple,
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
        backgroundColor: COLOR.purple, // Green color for apply button
    },
    buttonText: {
        textAlign: 'center',
        color: '#fff',
        fontWeight: 'bold',
    },
});
