import { Alert, Keyboard, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { COLOR, commonStyles, hp, TEXT_STYLE, wp } from '../../enums/StyleGuide'
import { AppHeader, BackBtn, Button, CustomIcon, Input, Label, Pressable, QuizEdit, Scrollable } from '../../components'
import { En } from '../../locales/En'
import { showFlash } from '../../utils/MyUtils'
import { useSelector } from 'react-redux'
import { addDocument, Delete, saveData } from '../../services/FirebaseMethods'
import { FIREBASE_COLLECTIONS, KEYBOARD_TYPE } from '../../enums/AppEnums'
import firestore from '@react-native-firebase/firestore';

const AddQuizScreen = (props) => {
  const { videoDocId } = props?.route?.params
  const [question, setQuestion] = useState('')
  const [answerText, setAnswerText] = useState('')
  const [answers, setAnswers] = useState([])
  const [correctAnswer, setCorrectAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const user = useSelector(({ appReducer }) => appReducer.user);
  const [quizList, setQuizList] = useState([]);
  const [showModal, setShowModal] = useState(false)
  const [selectedQuiz, setSelectedQuiz] = useState('')

  useEffect(() => {
    if (!videoDocId || !user?.uid) return;

    const unsubscribe = firestore()
      .collection(FIREBASE_COLLECTIONS.QUIZES) // Use your actual collection name
      .where("videoId", "==", videoDocId)
      .where("createdBy", "==", user?.uid) // Match createdBy with user.uid
      .orderBy("createdAt", "desc")
      .onSnapshot(snapshot => {
        if (snapshot) { // Check if snapshot exists
          const quizzes = snapshot.docs.map(doc => ({ ...doc.data() }));
          setQuizList(quizzes);
        } else {

        }
      }, error => {
        console.error("Error fetching quizzes:", error); // Handle errors
      });

    return () => unsubscribe(); // Clean up listener on unmount
  }, [videoDocId, user?.uid]);




  const addIntoAnswer = () => {
    Keyboard.dismiss()
    if (!question) {
      showFlash("Write question first!")
      return;
    }
    if (answers.length < 4) {
      setAnswers([...answers, answerText])
      setAnswerText('')
    } else {
      showFlash("limit reached", 'error')
    }
  }

  const handleUpload = async () => {



    if (!question) {
      showFlash("Write question", 'error')
      return;
    }

    if (answers.length !== 4 || answers.some(answer => answer.trim() === "")) {
      showFlash("Enter 4 valid answers. No answer can be empty.", "error")
      return;
    }


    if (!correctAnswer) {
      showFlash("Chose correct answer", 'error');
      return;
    }


    try {
      setLoading(true)

      const quizData = {
        question,
        answers,
        videoId: videoDocId,
        createdBy: user?.uid,
        correct_Option: correctAnswer
      };

      await addDocument(FIREBASE_COLLECTIONS.QUIZES, quizData)
      showFlash("Quiz uploaded successfully");
      setQuestion('');
      setAnswers([]);
      setCorrectAnswer('')

    } catch (error) {
      setLoading(false)
      console.log(error)
    } finally {
      setLoading(false)
    }

  }

  const openModal = (quiz) => {
    setSelectedQuiz(quiz);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedQuiz(null);
  };

  const handleDeleteAnswer = (index) => {
    setAnswers(prevAnswers => prevAnswers.filter((_, i) => i !== index));
  };

  const handleDelete = async (deleteItemData) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this item?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Delete canceled"),
          style: "cancel"
        },
        {
          text: "OK",
          onPress: async () => {
            try {
              await Delete(FIREBASE_COLLECTIONS.QUIZES, deleteItemData.documentId);
              showFlash("Deleted!");
            } catch (error) {
              console.error('Error deleting document:', error);
              showFlash("Failed to delete. Please try again.");
            }
          }
        }
      ],
      { cancelable: false } // Prevent closing the alert by tapping outside
    );
  }

  return (
    <View style={[commonStyles.container, styles.container]}>
      <AppHeader
        leftComp={<BackBtn />}
        title={En.quizSection}
      />

      <Scrollable hasInput>

        <Label style={styles.quizSectiontext}>{En.quizSectionText}</Label>

        <Input
          inputLabel={En.question}
          placeholder={En.writeHere}
          value={question}
          onChange={(e) => setQuestion(e)}
        />

        <Input
          inputLabel={En.answer}
          placeholder={En.writeHere}
          iconName="plus-circle"
          iconFamily="Feather"
          iconSize={hp(4)}
          value={answerText}
          onChange={(e) => setAnswerText(e)}
          iconPress={() => addIntoAnswer()}

        />

        <Input
          inputLabel={En.correctAnswer}
          placeholder={En.writeCorrectoption}
          value={correctAnswer}
          inputDisabled={true}
        />


        {question ? <Label style={styles.questionText}>{question}</Label> : null}

        <View style={styles.answersContainer}>
          {answers.map((answer, index) => (
            <View key={index} style={[commonStyles.justifyView, { width: "100%", }]}>
              <Label style={[styles.answerText, { width: "75%" }]}>{`${index + 1}. ${answer}`}</Label>
              <View style={[commonStyles.justifyView, { width: "25%", paddingHorizontal: "4%" }]}>
                <Pressable onPress={() => setCorrectAnswer(answer)}>
                  <CustomIcon name="check" family="AntDesign" size={hp(3)} />
                </Pressable>
                <Pressable onPress={() => handleDeleteAnswer(index)}>
                  <CustomIcon name="close" family="AntDesign" size={hp(3)} /> 
                </Pressable>
              </View>
            </View>
          ))}
        </View>
        <Button
          text={En.upload}
          style={{ marginVertical: hp(4) }}
          onPress={() => handleUpload()}
          isLoading={loading}
        />


        <Label style={styles.alreadyText}>Already added quiz</Label>


        {quizList.length > 0 ? (
          quizList.map((quiz, index) => (
            <View key={quiz.documentId} style={styles.quizContainer}>
              <View style={[commonStyles.horizontalView, { alignSelf: 'flex-end' }]}>
                <Pressable style={styles.editBtn} onPress={() => openModal(quiz)}>
                  <CustomIcon name={"edit"} family='Feather' size={hp(3)} />
                </Pressable>

                <Pressable onPress={() => handleDelete(quiz)}>
                  <CustomIcon name={"close"} family='AntDesign' size={hp(3)} />
                </Pressable>
              </View>

              <Label style={styles.questionText}>{`Q${index + 1}. ${quiz?.question}`}</Label>
              <View style={styles.answersContainer}>
                {(quiz.answers || []).map((answer, ansIndex) => (
                  <Label key={ansIndex} style={styles.answerText}>{`${ansIndex + 1}. ${answer}`}</Label>
                ))}
              </View>
              <Label style={styles.correctionText}>Correct answer: {quiz?.correct_Option}</Label>
            </View>
          ))
        ) : (
          <Label style={styles.noQuizzesText}>No quizzes added yet.</Label>
        )}

        <QuizEdit
          visible={showModal}
          onClose={closeModal}
          quiz={selectedQuiz}
        />


      </Scrollable>


    </View>
  )
}

export default AddQuizScreen

const styles = StyleSheet.create({
  container: {
    padding: "2%",
  },
  quizSectiontext: {
    paddingHorizontal: wp(4),
    marginVertical: hp(2)
  },
  questionText: {
    paddingHorizontal: wp(4),
    marginVertical: hp(1),
    fontSize: hp(2.2),
    fontWeight: 'bold',
    color: 'black',
  },
  answerText: {
    paddingHorizontal: wp(4),
    marginVertical: hp(0.5),
    color: 'grey',
  },
  alreadyText: {
    ...TEXT_STYLE.bigTextBold,
    textDecorationLine: 'underline',
  },
  noQuizzesText: {
    padding: wp(4),
    color: 'grey',
    textAlign: 'center',
  },
  quizContainer: {
    marginVertical: hp(1),
    padding: wp(4),
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  answersContainer: {
    paddingLeft: wp(4)
  },
  correctionText: {
    ...TEXT_STYLE.smallTextSemiBold,
    color: COLOR.purple,
    textAlign: 'right',
    marginTop: hp(0.5)
  },
  editBtn: {
    marginRight: wp(4)

  }

})