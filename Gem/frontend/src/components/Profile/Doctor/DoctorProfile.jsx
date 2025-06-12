import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../header/header";
import Footer from "../../footer/footer";
import DoctorProfileUpdate from "./updateDoctor";
import AppointmentToDoctors from "../../Appointment/Appointment";
import {
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Container,
  Link,
  Button,
} from "@mui/material";

import { Grid } from "@mui/material";

const DoctorProfile = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check user role based on localStorage

    if (
      localStorage.getItem("is_doctor") !== "true" &&
      localStorage.getItem("is_mediatationTeacher") == true &&
      localStorage.getItem("is_annoymousUser") != true
    ) {
      // Optional: Navigate to the doctor profile page if needed
      navigate("/profile/mediator-teacher");
    }

    if (
      localStorage.getItem("is_doctor") !== "true" &&
      localStorage.getItem("is_mediatationTeacher") !== true &&
      localStorage.getItem("is_annoymousUser") == true
    ) {
      // Optional: Navigate to the doctor profile page if needed
      navigate("/profile/user/");
    }

    if (
      localStorage.getItem("is_doctor") === "true" &&
      localStorage.getItem("is_mediatationTeacher") !== true &&
      localStorage.getItem("is_annoymousUser") !== true
    ) {
      // Optional: Navigate to the doctor profile page if needed
      navigate("/profile/doctor/");
    }
  }, [navigate]);

  return (
    <>
      <Header />
      <Container maxWidth={"lg"}>
        <Grid container spacing={3}>
          <Grid item md={4}>
            <DoctorProfileUpdate />
          </Grid>
          <Grid item md={8}>
            <AppointmentToDoctors />
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
};

export default DoctorProfile;
