import { StyleSheet, Text, View, Modal, Button } from 'react-native';
import React, { memo, useState } from 'react';
import { COLOR, hp, TEXT_STYLE } from '../../enums/StyleGuide';
import { Label } from '../reuseables';

const QuizResultModal = ({ visible, onClose,percentage }) => {
    return (
        <Modal
            transparent={true}
            animationType="slide"
            visible={visible}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <Label style={styles.modalTitle}>Quiz Result</Label>
                    <Label style={styles.modalMessage}>Congratulations on completing the quiz!</Label>
                    <Label style={styles.percentageText}>Your score is {percentage}%</Label>
                    <Button color={COLOR.purple} title="Okay" onPress={onClose} />
                </View>
            </View>
        </Modal>
    );
};

export default memo(QuizResultModal);

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
    percentageText:{
        ...TEXT_STYLE.textSemiBold,
        color:COLOR.purple,
        marginBottom:hp(2)
    }
});
