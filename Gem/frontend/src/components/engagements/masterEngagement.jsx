import BreathingExercise from "./engadgement";
import Quiz from "./quizGame";
import { Typography, Button, Grid, Box } from "@mui/material";
import { Route, Routes, Link } from "react-router-dom";
import AppFooter from "../footer/footer"

export default function MasterEngagement(){
    return(
        <>

        <Grid container>
            <Grid item md={12}>
            <BreathingExercise/>
            <br />
            </Grid>
            <AppFooter/>
        </Grid>
   
        </>
    )
}