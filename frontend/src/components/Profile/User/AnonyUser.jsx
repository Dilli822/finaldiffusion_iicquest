import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DoctorProfileUpdate from "../Doctor/updateDoctor";
import Appointment from "../../Appointment/Appointment";
import AppHeader from "../../header/header";
import { Grid,Container } from "@mui/material";
import AnyUserProfileUpdate from "./updateAnonyUser";
import FreeTimeSlots from "../../Appointment/Free_Slot_Time";
import AppointmentPlacementsList from "../../Appointment/appoint_placed";
import Community from "../../community/Community";
import UserPostsBlogs from "../../community/UserPostBlogs";
import JobPosts from "../../JobPosts/JobPosts";

const AnnoyUser = () => {
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
    <AppHeader/>
    <Container maxWidth={"lg"}> 
      <Grid container spacing={3}>
        <Grid item md={4}>
          <AnyUserProfileUpdate />
        </Grid>
        <Grid item md={8}>
          <UserPostsBlogs/>
     
          <br />
        </Grid>
      </Grid>


      <br />
      <br />
      </Container>
    </>
  );
};

export default AnnoyUser;
