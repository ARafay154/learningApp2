import { StyleSheet, Text, View, Modal, } from 'react-native';
import React, { memo, useState } from 'react';
import { COLOR, hp, TEXT_STYLE } from '../../enums/StyleGuide';
import { Button, CustomIcon, Label, Pressable } from '../reuseables';
import ImagePicker from 'react-native-image-crop-picker';

const ProfileModal = ({ visible, onClose, setImage ,setShowModal}) => {


    const handleCamera = () => {
        ImagePicker.openCamera({
            cropping: true,
            mediaType: 'photo',
            width: 300,
            height: 400,
            
        })
            .then(pic => {
                setImage(pic.path);
                setShowModal(false)
            })
            .catch(error => {
                // console.log("Error opening camera:", error);
            });
    };

    const handleGallery = () => {
        ImagePicker.openPicker({
            cropping: true,
            mediaType: 'photo',
            width: 300,
            height: 400,
          
        })
            .then(pic => {
                setImage(pic.path);
                setShowModal(false)
            })
            .catch(error => {
                // console.log("Error opening gallery:", error);
            });
    };



    return (
        <Modal
            transparent={true}
            animationType="slide"
            visible={visible}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <Label style={styles.modalTitle}>Upload Profile Image </Label>
                    <Label style={styles.modalMessage}>Open your mobile gallery or camera to upload your profile image.</Label>
                    <View style={styles.actionButtons}>
                        <Pressable style={styles.profileIconPress} onPress={handleGallery}>
                            <CustomIcon name="picture" family='AntDesign' size={hp(4)} color={COLOR.purple} />
                            <Label style={styles.iconLabel}>Gallery</Label>
                        </Pressable>
                        <Pressable style={styles.profileIconPress} onPress={handleCamera}>
                            <CustomIcon name="camerao" family='AntDesign' size={hp(4)} color={COLOR.purple} />
                            <Label style={styles.iconLabel}>Camera</Label>
                        </Pressable>
                    </View>
                    <Button style={styles.closeBtn} color={COLOR.purple} text="Cancel" onPress={onClose} />
                </View>
            </View>
        </Modal>
    );
};

export default memo(ProfileModal);

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: 300,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        marginBottom: hp(1),
        ...TEXT_STYLE.bigTextSemiBold
    },
    modalMessage: {
        marginBottom: hp(1),
        textAlign: 'center',
    },
    percentageText: {
        ...TEXT_STYLE.textSemiBold,
        color: COLOR.purple,
        marginBottom: hp(2)
    },
    actionButtons: {
        flexDirection: 'row',
        width: "100%",
        justifyContent: 'space-evenly',
        marginVertical: hp(4)
    },
    iconLabel: {
        marginTop: hp(1),
        ...TEXT_STYLE.smallTextSemiBold,
        color: COLOR.purple
    },
    profileIconPress: {
        backgroundColor: COLOR.light_grey2,

        borderRadius: 10,             // Makes the icon button round
        alignItems: 'center',
        justifyContent: 'center',
        width: hp(13),
        height: hp(10),

        // Shadow for iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,

        // Elevation for Android
        elevation: 6,
    },
    closeBtn: {
        width: "50%"
    }
});
