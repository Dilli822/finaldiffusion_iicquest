// MainApp.js (or any other appropriate component where you want to set up routing)
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from '@mui/material/styles';
import MainRouter from "./routes";
import "./App.css"
import theme from './theme'; // Import your custom theme
// import TipsCards from './components/TipsCards/TipsCards';

export default function MainApp() {
  return (
    <Router>
       <ThemeProvider theme={theme}>
      <MainRouter />
      </ThemeProvider>

      {/* <TipsCards/> */}
    </Router>
  );
}