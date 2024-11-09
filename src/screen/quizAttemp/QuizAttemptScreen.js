import { StyleSheet, Text, View, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { COLOR, commonStyles, hp } from '../../enums/StyleGuide';
import { AppHeader, BackBtn, Label, Loader, QuizResultModal } from '../../components';
import { En } from '../../locales/En';
import firestore from '@react-native-firebase/firestore';
import { FIREBASE_COLLECTIONS } from '../../enums/AppEnums';
import { useSelector } from 'react-redux';

const QuizAttemptScreen = (props) => {
  const { videoDocId } = props?.route?.params;
  const { navigation } = props;
  const [quizzes, setQuizzes] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [scorePercentage, setScorePercentage] = useState(0);
  const [loading, setLoading] = useState(true); // Start loading as true
  const user = useSelector(({ appReducer }) => appReducer.user);
  const [resultShow, setResultShow] = useState(false);

  useEffect(() => {
    if (videoDocId) {
      const fetchQuizzes = async () => {
        try {
          const snapshot = await firestore()
            .collection(FIREBASE_COLLECTIONS.QUIZES)
            .where('videoId', '==', videoDocId)
            .orderBy('createdAt', 'asc')
            .get();

          const quizzesData = snapshot.empty
            ? []
            : snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }));

          setQuizzes(quizzesData);
        } catch (error) {
          console.error("Error fetching quizzes: ", error);
          setQuizzes([]);
        } finally {
          setLoading(false); // Stop loading after fetching
        }
      };

      fetchQuizzes();
    }
  }, [videoDocId]);

  const handleAnswerSelect = async (selectedAnswer) => {
    const currentQuestion = quizzes[currentQuestionIndex];
    if (!currentQuestion) {
      console.error("Current question not found");
      return;
    }

    setLoading(true);

    try {
      const updatedAnswers = currentQuestion.usersAnswer || [];
      const userAnswerIndex = updatedAnswers.findIndex(answer => answer.answerBy === user?.uid);

      if (userAnswerIndex >= 0) {
        updatedAnswers[userAnswerIndex].answer = selectedAnswer;
      } else {
        updatedAnswers.push({
          answerBy: user?.uid,
          answer: selectedAnswer,
        });
      }

      await firestore()
        .collection(FIREBASE_COLLECTIONS.QUIZES)
        .doc(currentQuestion.id)
        .update({ usersAnswer: updatedAnswers });

      // Check if the selected answer is correct
      if (currentQuestion.correct_Option === selectedAnswer) {
        // Update the correct answers count
        const newCorrectAnswersCount = correctAnswersCount + 1;
        setCorrectAnswersCount(newCorrectAnswersCount);
      }

      if (currentQuestionIndex < quizzes.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        // Calculate the final score percentage
        const finalScorePercentage = (correctAnswersCount + (currentQuestion.correct_Option === selectedAnswer ? 1 : 0)) / quizzes.length * 100;
        setScorePercentage(finalScorePercentage.toFixed(0));
        setResultShow(true);
      }
    } catch (error) {
      console.error("Error saving answer: ", error);
      Alert.alert("Error", "There was an error submitting your answer.");
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setResultShow(false);
    navigation.goBack();
  }

  const currentQuestion = quizzes[currentQuestionIndex];

  return (
    <View style={commonStyles.container}>
      <AppHeader leftComp={<BackBtn />} title={En.quizTest} />
      {loading ? ( // Show loading indicator while fetching quizzes
        <Loader  style={styles.loadingIndicator} />
      ) : quizzes.length > 0 ? ( // Check if quizzes are available
        <View style={styles.questionContainer}>
          <Label style={styles.questionText}>{currentQuestion.question}</Label>
          {currentQuestion.answers.map((answer, index) => (
            <TouchableOpacity
              key={index}
              style={styles.answerButton}
              onPress={() => handleAnswerSelect(answer)}
              disabled={loading}
            >
              <Label style={styles.answerText}>{answer}</Label>
            </TouchableOpacity>
          ))}

          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>
              Question {currentQuestionIndex + 1} of {quizzes.length}
            </Text>
          </View>
          {loading && <Loader style={styles.loadingIndicator} />}
        </View>
      ) : ( // No quizzes available message
        <Label style={styles.loadingText}>No quizzes available</Label>
      )}

      <QuizResultModal
        visible={resultShow}
        onClose={() => handleModalClose()}
        percentage={scorePercentage}
      />
    </View>
  );
};

export default QuizAttemptScreen;

const styles = StyleSheet.create({
  questionContainer: {
    padding: 16,
  },
  questionText: {
    fontSize: 18,
    marginBottom: 12,
    fontWeight: 'bold',
  },
  answerButton: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginVertical: hp(1),
    borderRadius: 5,
    shadowColor: COLOR.purple,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    
    // Elevation for Android
    elevation: 3,
  },
  answerText: {
    fontSize: 16,
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  progressContainer: {
    marginTop: 20,
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  progressText: {
    fontSize: 16,
    color: '#333',
  },
  percentageText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLOR.purple,
    marginTop: 8,
  },
  loadingIndicator: {
    marginTop: hp(6),
  },
});
