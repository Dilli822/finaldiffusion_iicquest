import React, { useState, useEffect } from "react";
import { Button, Typography, Container, Grid } from "@mui/material";
import DeepMeditate1 from "../assets/mp3/deep-meditation-1.mp3";
import Quiz from "./quizGame";
import PublicHeader from "../header/header_public";

const BreathingExercise = () => {
  const [timer, setTimer] = useState(0);
  const [phase, setPhase] = useState("inhale");
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio] = useState(new Audio(DeepMeditate1)); // Initialize audio element

  // Handle starting audio playback
  const handleStart = () => {
    if (!isPlaying) {
      audio.play().catch((error) => {
        console.error("Audio playback error:", error);
      });
      setIsPlaying(true);
    }
  };

  // Handle stopping audio playback
  const handleEnd = () => {
    if (isPlaying) {
      audio.pause();
      audio.currentTime = 0;
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    // Function to manage timer and phase transitions
    let interval;
    if (phase === "inhale") {
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer >= 3) {
            setPhase("hold");
            setTimer(0);
            return 0;
          }
          return prevTimer + 1;
        });
      }, 1000);
    } else if (phase === "hold") {
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer >= 7) {
            setPhase("exhale");
            setTimer(0);
            return 0;
          }
          return prevTimer + 1;
        });
      }, 1000);
    } else if (phase === "exhale") {
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer >= 4) {
            setPhase("inhale");
            setTimer(0);
            return 0;
          }
          return prevTimer + 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [phase]);

  // Reset phase and timer when exercise starts
  const startExercise = () => {
    setPhase("inhale");
    setTimer(0);
  };

  return (
    <> 
    <PublicHeader> </PublicHeader>
    <br />    <br />
    <Container className="breathing-exercise" maxWidth="lg">
      <Grid container spacing={3} alignItems="center">
        <Grid item md={6}>
          <Typography variant="h5" component="h2" gutterBottom>
            Meditation
          </Typography>
          <img
            src="https://cdn.dribbble.com/users/3414434/screenshots/14616859/media/94814b2e5bcd1dd9f926bdd0d98eda5c.gif"
            alt=""
            style={{ maxWidth: "100%", height: "100%" }}
          />
       
          <Button variant="outlined" onClick={handleStart}>
            Start Meditation 
          </Button>{" "}
          &nbsp;
          <Button
            variant="outlined"
            sx={{ border: "1px solid red", color: "red" }}
            onClick={handleEnd}
          >
            End
          </Button>
        </Grid>
        <Grid item md={6}>
          <Typography variant="h5" component="h2" gutterBottom sx={{ textAlign: "center" }}>
            Breathing Exercise
          </Typography>
          <img
            src="https://cdn.doyou.com/articles/6a-1575918606525.gif=w1080"
            alt="Breathing Exercise GIF"
            style={{ height: "auto" }}
          />
          <Typography
            variant="h3"
            component="div"
            className="timer"
            sx={{ mt: 2, textAlign: "center" }}
          >
            {timer}s
          </Typography>
        </Grid>
        
      </Grid>
      <br />
      <Quiz />
    </Container>
    </>
  );
};

export default BreathingExercise;
