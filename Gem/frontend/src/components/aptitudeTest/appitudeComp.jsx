import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import HeaderPublic from "../header/header_public";
import AppFooter from "../footer/footer";
import {
  Container,
  Button,
  Typography,
  Box,
  Grid,
  CircularProgress,
} from "@mui/material";
import Question from "./appitude"; // Assuming you have a Question component
import PieChartComponent from "../charts/pieChart";
import { Pie } from "react-chartjs-2";

const questionsDataSet1 = {
  questions: [
    {
      id: 1,
      question:
        "How often do you feel overwhelmed with your schoolwork and extracurricular activities?",
      options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
      weightage: 5,
      category: "stress",
    },
    {
      id: 2,
      question:
        "In the past month, how often have you felt nervous or stressed?",
      options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
      weightage: 5,
      category: "anxiety",
    },
    {
      id: 3,
      question:
        "How often do you find it difficult to concentrate on your studies due to stress?",
      options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
      weightage: 4,
      category: "stress",
    },
    {
      id: 4,
      question:
        "Do you often feel tired or lack energy even after sleeping well?",
      options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
      weightage: 4,
      category: "depression",
    },
    {
      id: 5,
      question:
        "How often do you worry about your future or college applications?",
      options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
      weightage: 5,
      category: "anxiety",
    },
    {
      id: 6,
      question:
        "Do you experience headaches or other physical symptoms due to stress?",
      options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
      weightage: 4,
      category: "stress",
    },
    {
      id: 7,
      question: "How often do you feel you have too many responsibilities?",
      options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
      weightage: 5,
      category: "stress",
    },
    {
      id: 8,
      question:
        "Do you feel you have a healthy balance between schoolwork and leisure activities?",
      options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
      weightage: 3,
      category: "normal",
    },
    {
      id: 9,
      question:
        "How often do you feel you lack control over the important things in your life?",
      options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
      weightage: 5,
      category: "depression",
    },
    {
      id: 10,
      question: "Do you have trouble sleeping due to stress or anxiety?",
      options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
      weightage: 4,
      category: "anxiety",
    },
    {
      id: 11,
      question:
        "How often do you feel under pressure to perform well academically?",
      options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
      weightage: 5,
      category: "stress",
    },
    {
      id: 12,
      question:
        "Do you feel supported by friends or family when you are stressed?",
      options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
      weightage: 3,
      category: "normal",
    },
    {
      id: 13,
      question:
        "How often do you find yourself irritable or angry due to stress?",
      options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
      weightage: 4,
      category: "stress",
    },
    {
      id: 14,
      question:
        "Do you find it hard to relax or calm down when you're stressed?",
      options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
      weightage: 4,
      category: "anxiety",
    },
    {
      id: 15,
      question: "How often do you feel lonely or isolated when stressed?",
      options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
      weightage: 4,
      category: "depression",
    },
    {
      id: 16,
      question:
        "Do you find it difficult to keep up with your hobbies or interests due to stress?",
      options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
      weightage: 3,
      category: "normal",
    },
    {
      id: 17,
      question:
        "How often do you experience changes in your appetite due to stress?",
      options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
      weightage: 3,
      category: "depression",
    },
    {
      id: 18,
      question:
        "Do you feel confident in your ability to handle personal problems?",
      options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
      weightage: 3,
      category: "normal",
    },
    {
      id: 19,
      question:
        "How often do you feel that stress affects your relationships with friends or family?",
      options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
      weightage: 4,
      category: "stress",
    },
    {
      id: 20,
      question:
        "Do you feel you have enough time for yourself despite your responsibilities?",
      options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
      weightage: 3,
      category: "normal",
    },
  ],
};

const questionsDataSet2 = {
  questions: [
    {
      id: 21,
      question:
        "How often do you feel overwhelmed with your schoolwork and extracurricular activities?",
      options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
      weightage: 5,
      category: "stress",
    },
    {
      id: 22,
      question:
        "In the past month, how often have you felt nervous or stressed?",
      options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
      weightage: 5,
      category: "anxiety",
    },
    {
      id: 23,
      question:
        "How often do you find it difficult to concentrate on your studies due to stress?",
      options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
      weightage: 4,
      category: "stress",
    },
    {
      id: 24,
      question:
        "Do you often feel tired or lack energy even after sleeping well?",
      options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
      weightage: 4,
      category: "depression",
    },
    {
      id: 25,
      question:
        "How often do you worry about your future or college applications?",
      options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
      weightage: 5,
      category: "anxiety",
    },
    {
      id: 26,
      question:
        "Do you experience headaches or other physical symptoms due to stress?",
      options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
      weightage: 4,
      category: "stress",
    },
    {
      id: 27,
      question: "How often do you feel you have too many responsibilities?",
      options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
      weightage: 5,
      category: "stress",
    },
    {
      id: 28,
      question:
        "Do you feel you have a healthy balance between schoolwork and leisure activities?",
      options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
      weightage: 3,
      category: "normal",
    },
    {
      id: 29,
      question:
        "How often do you feel you lack control over the important things in your life?",
      options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
      weightage: 5,
      category: "depression",
    },
    {
      id: 30,
      question: "Do you have trouble sleeping due to stress or anxiety?",
      options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
      weightage: 4,
      category: "anxiety",
    },
    {
      id: 31,
      question:
        "How often do you feel under pressure to perform well academically?",
      options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
      weightage: 5,
      category: "stress",
    },
    {
      id: 32,
      question:
        "Do you feel supported by friends or family when you are stressed?",
      options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
      weightage: 3,
      category: "normal",
    },
    {
      id: 33,
      question:
        "How often do you find yourself irritable or angry due to stress?",
      options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
      weightage: 4,
      category: "stress",
    },
    {
      id: 34,
      question:
        "Do you find it hard to relax or calm down when you're stressed?",
      options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
      weightage: 4,
      category: "anxiety",
    },
    {
      id: 35,
      question: "How often do you feel lonely or isolated when stressed?",
      options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
      weightage: 4,
      category: "depression",
    },
    {
      id: 36,
      question:
        "Do you find it difficult to keep up with your hobbies or interests due to stress?",
      options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
      weightage: 3,
      category: "normal",
    },
    {
      id: 37,
      question:
        "How often do you experience changes in your appetite due to stress?",
      options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
      weightage: 3,
      category: "depression",
    },
    {
      id: 38,
      question:
        "Do you feel confident in your ability to handle personal problems?",
      options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
      weightage: 3,
      category: "normal",
    },
    {
      id: 39,
      question:
        "How often do you feel that stress affects your relationships with friends or family?",
      options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
      weightage: 4,
      category: "stress",
    },
    {
      id: 40,
      question:
        "Do you feel you have enough time for yourself despite your responsibilities?",
      options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
      weightage: 3,
      category: "normal",
    },
  ],
};

const questionsDataSet3 = {
  questions: [
    // Anxiety category
    {
      id: 41,
      question: "How often do you feel in control of your emotions?",
      options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
      weightage: 5,
      category: "anxiety",
    },
    {
      id: 42,
      question: "Do you find it easy to express your feelings to others?",
      options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
      weightage: 4,
      category: "anxiety",
    },
    {
      id: 43,
      question: "How often do you experience sudden feelings of nervousness?",
      options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
      weightage: 5,
      category: "anxiety",
    },
    {
      id: 44,
      question: "Do you feel anxious when faced with unfamiliar situations?",
      options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
      weightage: 4,
      category: "anxiety",
    },
    {
      id: 45,
      question: "How often do you feel restless or on edge?",
      options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
      weightage: 5,
      category: "anxiety",
    },

    // Stress category
    {
      id: 46,
      question: "Do you feel overwhelmed by your responsibilities?",
      options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
      weightage: 3,
      category: "stress",
    },
    {
      id: 47,
      question: "How often do you struggle with time management?",
      options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
      weightage: 4,
      category: "stress",
    },
    {
      id: 48,
      question: "Do you feel your stress affects your health?",
      options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
      weightage: 5,
      category: "stress",
    },
    {
      id: 49,
      question: "How often do you feel tense or under pressure?",
      options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
      weightage: 4,
      category: "stress",
    },
    {
      id: 50,
      question: "Do you find it hard to relax after a stressful day?",
      options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
      weightage: 3,
      category: "stress",
    },

    // Normal category
    {
      id: 51,
      question: "How often do you experience feelings of gratitude?",
      options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
      weightage: 5,
      category: "normal",
    },
    {
      id: 52,
      question: "Do you feel satisfied with your current routine?",
      options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
      weightage: 4,
      category: "normal",
    },
    {
      id: 53,
      question:
        "How often do you reflect on positive experiences in your life?",
      options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
      weightage: 5,
      category: "normal",
    },
    {
      id: 54,
      question: "Do you feel content with your relationships?",
      options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
      weightage: 4,
      category: "normal",
    },
    {
      id: 55,
      question: "How often do you feel confident in your abilities?",
      options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
      weightage: 5,
      category: "normal",
    },

    // Depression category
    {
      id: 56,
      question: "Do you feel that you are growing personally and emotionally?",
      options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
      weightage: 4,
      category: "depression",
    },
    {
      id: 57,
      question:
        "How often do you feel a lack of motivation to engage in activities?",
      options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
      weightage: 5,
      category: "depression",
    },
    {
      id: 58,
      question: "Do you feel disconnected from people around you?",
      options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
      weightage: 4,
      category: "depression",
    },
    {
      id: 59,
      question:
        "How often do you experience feelings of sadness or hopelessness?",
      options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
      weightage: 5,
      category: "depression",
    },
    {
      id: 60,
      question:
        "Do you find it difficult to enjoy activities you used to like?",
      options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
      weightage: 4,
      category: "depression",
    },
  ],
};

const questionsDataSet4 = {
  questions: [
    // Anxiety category
    {
      id: 61,
      question: "How often do you feel like avoiding social situations?",
      options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
      weightage: 4,
      category: "anxiety",
    },
    {
      id: 62,
      question: "Do you experience panic or fear without a clear reason?",
      options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
      weightage: 5,
      category: "anxiety",
    },
    {
      id: 63,
      question: "How often do you worry excessively about daily tasks?",
      options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
      weightage: 5,
      category: "anxiety",
    },
    {
      id: 64,
      question:
        "Do you feel like your mind is constantly racing with thoughts?",
      options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
      weightage: 4,
      category: "anxiety",
    },
    {
      id: 65,
      question: "How often do you feel a sense of dread or impending danger?",
      options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
      weightage: 5,
      category: "anxiety",
    },

    // Stress category
    {
      id: 66,
      question:
        "Do you feel physically exhausted even when you haven't done much?",
      options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
      weightage: 3,
      category: "stress",
    },
    {
      id: 67,
      question: "How often do you have trouble sleeping due to stress?",
      options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
      weightage: 4,
      category: "stress",
    },
    {
      id: 68,
      question: "Do you find it hard to concentrate when you're stressed?",
      options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
      weightage: 5,
      category: "stress",
    },
    {
      id: 69,
      question: "How often do you feel irritable or angry when under pressure?",
      options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
      weightage: 4,
      category: "stress",
    },
    {
      id: 70,
      question: "Do you frequently experience headaches or muscle tension?",
      options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
      weightage: 3,
      category: "stress",
    },

    // Normal category
    {
      id: 71,
      question: "How often do you engage in hobbies or activities you enjoy?",
      options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
      weightage: 5,
      category: "normal",
    },
    {
      id: 72,
      question: "Do you feel a sense of balance between work and relaxation?",
      options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
      weightage: 4,
      category: "normal",
    },
    {
      id: 73,
      question:
        "How often do you find yourself laughing or smiling throughout the day?",
      options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
      weightage: 5,
      category: "normal",
    },
    {
      id: 74,
      question: "Do you feel that you have meaningful connections with others?",
      options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
      weightage: 4,
      category: "normal",
    },
    {
      id: 75,
      question: "How often do you wake up feeling rested and energized?",
      options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
      weightage: 5,
      category: "normal",
    },

    // Depression category
    {
      id: 76,
      question: "Do you often feel emotionally numb or detached?",
      options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
      weightage: 5,
      category: "depression",
    },
    {
      id: 77,
      question:
        "How often do you experience feelings of guilt or worthlessness?",
      options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
      weightage: 5,
      category: "depression",
    },
    {
      id: 78,
      question: "Do you have trouble concentrating or making decisions?",
      options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
      weightage: 4,
      category: "depression",
    },
    {
      id: 79,
      question: "How often do you feel like life has no purpose or meaning?",
      options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
      weightage: 5,
      category: "depression",
    },
    {
      id: 80,
      question: "Do you find yourself withdrawing from family and friends?",
      options: ["Never", "Rarely", "Sometimes", "Often", "Always"],
      weightage: 4,
      category: "depression",
    },
  ],
};

// Step 2: Function to select a random array
const getRandomArray = () => {
  const arrays = [
    questionsDataSet1,
    questionsDataSet2,
    questionsDataSet3,
    questionsDataSet4,
  ];
  const randomIndex = Math.floor(Math.random() * arrays.length);
  return arrays[randomIndex];
};

// Use getRandomArray() wherever you need to work with questionsData
const questionsData = getRandomArray();

const AptitudeTest = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleOptionChange = (event) => {
    setAnswers({
      ...answers,
      [currentQuestionIndex]: event.target.value,
    });
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
  };

  const handlePreviousQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
  };

  const handleSubmitQuiz = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowResults(true);
    }, 1000); // Simulate a delay for processing
  };

  const handleSkipQuestion = () => {
    setAnswers({
      ...answers,
      [currentQuestionIndex]: "Skipped",
    });
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
  };

  const calculateScore = () => {
    const categoryScores = {
      stress: 0,
      anxiety: 0,
      depression: 0,
      normal: 0,
    };

    questionsData.questions.forEach((question, index) => {
      const answer = answers[index];
      if (answer === question.options[4]) {
        categoryScores[question.category] += question.weightage;
      }
    });

    return categoryScores;
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (showResults) {
    const categoryScores = calculateScore();
    const totalWeightage = questionsData.questions.reduce(
      (total, question) => total + question.weightage,
      0
    );

    const percentageScores = {
      stress: ((categoryScores.stress / totalWeightage) * 60).toFixed(2),
      anxiety: ((categoryScores.anxiety / totalWeightage) * 60).toFixed(2),
      depression: ((categoryScores.depression / totalWeightage) * 60).toFixed(
        2
      ),
      normal: 40,
    };

    const data = {
      labels: ["Stress", "Anxiety", "Depression", "Normal"],
      datasets: [
        {
          data: [
            percentageScores.stress,
            percentageScores.anxiety,
            percentageScores.depression,
            percentageScores.normal,
          ],
          backgroundColor: ["red", "blue", "yellow", "green"],
          borderColor: ["red", "blue", "yellow", "green"],
          borderWidth: 1,
        },
      ],
    };

    return (
      <>
        <HeaderPublic />
        <br /> <br />
        <Container maxWidth={"lg"}>
          <Grid container sx={{ display: "flex", alignItems: "center" }}>
            <Grid item md={7}>
              <Typography variant="h3">Aptitude Test Results</Typography>
              <Typography variant="h5">Your score breakdown:</Typography>
              <Typography variant="h6">
                Stress: {percentageScores.stress}% | Anxiety:{" "}
                {percentageScores.anxiety}% | Depression:{" "}
                {percentageScores.depression}% | Normal:{" "}
                {percentageScores.normal}%
              </Typography>
              <br />
              <hr />
              <Typography style={{ fontSize: "12px" }}>
                <i>
                  It's important to note that there is no test for mental health
                  that guarantees 100% accuracy. The assessment provided here
                  relies on self-reported answers from users, which can vary
                  based on personal experiences and perceptions. This means that
                  while the results can provide insights, they should not
                  replace professional evaluation or treatment. Always consult
                  with a mental health professional for a comprehensive
                  assessment.
                </i>
              </Typography>
              <br />
              <Link to="/">
                <Button variant="outlined">Back to Home</Button>
              </Link>
            </Grid>

            <Grid item md={5} sx={{ mt: 3 }}>
              <Pie data={data} />
            </Grid>
          </Grid>
        </Container>
        <br /> <br />
        <AppFooter />
      </>
    );
  }

  const currentQuestion = questionsData.questions[currentQuestionIndex];

  return (
    <>
      <Question
        question={`${currentQuestion.id}. ${currentQuestion.question}`}
        options={currentQuestion.options}
        selectedOption={answers[currentQuestionIndex] || ""}
        onChange={handleOptionChange}
      />
      <Container>
        <Box mt={2}>
          {currentQuestionIndex > 0 && (
            <Button
              variant="contained"
              color="secondary"
              onClick={handlePreviousQuestion}
              sx={{ mr: 2 }}
            >
              Previous
            </Button>
          )}
          {currentQuestionIndex < questionsData.questions.length - 1 && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleNextQuestion}
            >
              Next
            </Button>
          )}
          &nbsp;&nbsp;
          {currentQuestionIndex < questionsData.questions.length - 1 && (
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleSkipQuestion}
              sx={{ mr: 2 }}
            >
              Skip
            </Button>
          )}
          {currentQuestionIndex === questionsData.questions.length - 1 && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmitQuiz}
            >
              Submit
            </Button>
          )}
        </Box>
      </Container>
      <br /> <br /> <br /> <br /> <br /> <br />
      <AppFooter />
    </>
  );
};

export default AptitudeTest;
