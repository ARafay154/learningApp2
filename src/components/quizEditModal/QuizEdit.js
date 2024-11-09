// QuizDetailModal.js
import React, { memo, useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, TextInput, View } from 'react-native';
import { Button, Input, Label, Scrollable } from '../../components'; // Assuming you have a custom Button component
import { hp, TEXT_STYLE, wp } from '../../enums/StyleGuide';
import { En } from '../../locales/En';
import { saveData } from '../../services/FirebaseMethods';
import { FIREBASE_COLLECTIONS, KEYBOARD_TYPE } from '../../enums/AppEnums';


const QuizEdit = ({ visible, onClose, quiz }) => {

  const [question, setQuestion] = useState('');
  const [answers, setAnswers] = useState([]);
  const [correctOption, setCorrectOption] = useState('');
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (quiz) {
      setQuestion(quiz?.question);
      setAnswers(quiz?.answers || []);
      setCorrectOption(quiz?.correct_Option);
    }
  }, [quiz]);

  const handleSave = async () => {


    const updatedQuiz = {
      ...quiz,
      question: question !== quiz?.question ? question : quiz?.question,
      answers: answers.map((answer, index) => (answer !== quiz?.answers[index] ? answer : quiz?.answers[index])),
      correct_Option: correctOption !== quiz?.correct_Option ? correctOption : quiz?.correct_Option,
    };

    const isUpdated =
      updatedQuiz.question !== quiz.question ||
      !updatedQuiz.answers.every((answer, index) => answer === quiz.answers[index]) ||
      updatedQuiz.correct_Option !== quiz.correct_Option;

    if (!isUpdated) {

      alert('No changes were made to the quiz.');
      onClose();
      return;
    }
    try {
      setLoading(true)
      await saveData(FIREBASE_COLLECTIONS.QUIZES, quiz?.documentId, updatedQuiz);
      alert('Quiz updated successfully!');
    } catch (error) {
      console.error('Error updating quiz:', error);
      alert('Failed to update quiz. Please try again.');
      setLoading(false)
    } finally {
      setLoading(false)
    }

    onClose();
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="slide"
    >
      <View style={styles.overlay}>
        <Scrollable containerStyle={styles.modalContainer}>
          <Label style={styles.title}>Edit Quiz</Label>

          <Input
            value={question}
            onChange={setQuestion}
            placeholder="Enter question"
          />

          <Label style={styles.answerText}>Answers:</Label>
          {answers.map((answer, index) => (
            <Input
              key={index}
              value={answer}
              onChange={(text) => {
                const updatedAnswers = [...answers];
                updatedAnswers[index] = text;
                setAnswers(updatedAnswers);
              }}
              placeholder={`Answer ${index + 1}`}
              iconName="check"
              iconFamily="AntDesign"
              iconSize={hp(3)}
              iconPress={() => setCorrectOption(answer)}
            />
          ))}

          <Input
            inputLabel={"Correct Answer"}
            keyboard={KEYBOARD_TYPE.DECIMAL_PAD}
            value={correctOption}
            placeholder="Correct option (1, 2, ...)"
            inputDisabled={true}
          />
          <Label style={styles.updateCorrectText}>Update correct answer by press tick icon against options</Label>

          <Button isLoading={loading} text="Save" onPress={handleSave} style={{ marginTop: hp(2) }} />
          <Button text="Close" onPress={onClose} style={{ marginTop: hp(1) }} />
        </Scrollable>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingTop: hp(4)
  },
  modalContainer: {
    width: wp(90),
    backgroundColor: 'white',
    borderRadius: 10,
    padding: hp(4),
  },
  title: {
    fontSize: hp(2.5),
    fontWeight: 'bold',
    marginBottom: hp(2),
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: hp(1),
    marginBottom: hp(2),
    fontSize: hp(2),
  },
  answerText: {
    ...TEXT_STYLE.textSemiBold
  },
  correctOptionText: {
    fontSize: hp(2),
    marginTop: hp(2),
    fontWeight: 'bold',
  },
  updateCorrectText:{
    ...TEXT_STYLE.smallTextMedium
  }
});

export default memo(QuizEdit);
