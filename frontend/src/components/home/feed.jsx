// import AppFooter from '../Footer/AppFooter'
import HeaderNav from "../header/header";
import Banner from "../Banner/Banner";
import TipsCards from "../TipsCards/TipsCards";
import AppFooter from "../footer/footer";
import Notification from "../Notifications/Notifications";
import Home from "./home";
import React, { useState, useEffect } from "react";
import Header from "../header/header";
import EmergencySupport from "../Emergency/Emergency";
import LandingPage from "../LandingPage/LadingPage";
import GeolocationComponent from "../charts/geoLocation";
import PieChartComponent from "../charts/pieChart";

import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  IconButton,
  Drawer,
  List,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  CardMedia,
  ListItem,
  ListItemText,
  TextField,
  Menu,
  MenuItem,
  useMediaQuery,
  createTheme, // Import createTheme
} from "@mui/material";

function Feed() {
  // Function to fetch user data and store user ID in localStorage
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        "http://localhost:8000/sushtiti/account/auth/user/",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();

        console.log(data);
        const userId = data.id;
        localStorage.setItem("userId", userId);
        localStorage.setItem("is_doctor", data.is_doctor);
        localStorage.setItem(
          "is_mediatationTeacher",
          data.is_mediatationTeacher
        );
        localStorage.setItem("is_annoymousUser", data.is_annoymousUser);

        console.log(data);
      } else {
        console.error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Fetch posts from API on component mount
  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <>
      <Header />
      <Grid container spacing={2}></Grid>
      <LandingPage />
      <GeolocationComponent />
      <TipsCards />
      <AppFooter />
    </>
  );
}

export default Feed;
