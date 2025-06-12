// import AppFooter from '../Footer/AppFooter'
import HeaderNav from "../header/header";
import Banner from "../Banner/Banner";
import TipsCards from "../TipsCards/TipsCards";
import AppFooter from "../footer/footer";
import Notification from "../Notifications/Notifications";
import HeaderPublic from "../header/header_public";
import { useNavigate } from "react-router-dom";
import LandingPage from "../LandingPage/LadingPage";
import React, { useState, useEffect } from "react";
import EmergencySupport from "../Emergency/Emergency";
import PieChartComponent from "../charts/pieChart";
import GeolocationComponent from "../charts/geoLocation";
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

// import SearchComponent from "../Search/Searching"
function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      navigate("/feed");
    }
  }, [navigate]);

  return (
    <>
      <HeaderPublic />
     
      <GeolocationComponent />
      <LandingPage />
      <TipsCards />
      <AppFooter />
      
    </>
  );
}

export default Home;
