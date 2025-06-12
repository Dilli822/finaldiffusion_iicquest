import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Container,
  Button,
  Grid,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Emergency from "../Emergency/Emergency";
import Widget from "../Widget/Widget";
import Projects from "../Project/Projects";
import Join from "../Join/Join";
import DoctorsList from "../nearby/doctorsNearby";
import brainImg from "../assets/brainImg.png";
import EmergencySupport from "../Emergency/Emergency";
import HopeLight from "../assets/img/mix/IdeaHopeLight.jpg";
import Community from "../community/Community";
import Banner from "../assets/Banner.png";
import LiveShare from "../assets/LiveStreaming.jpg";
import VideoCall from "../assets/VideoCall.jpg";
import LimitedPosts from "../community/LimitedPosts";
import FeaturesPoster from "../assets/FeaturesPosters.jpg"
export default function LandingPageLogged() {
  return (
    <>
      {/* <Emergency /> */}
      {/* <Carousel/> */}
      <Container maxWidth={"lg"}>
        
        {/* <EmergencySupport/> */}
<br /><br />
        <Community />
        <hr></hr>
        <Typography gutterBottom sx={{ fontSize: "48px", fontWeight: "" }}>
          FAQs
        </Typography>
        <Box>
          <Accordion sx={{ backgroundColor: "#fff", color: "black", mb: 2 }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              <Typography variant="h6">What is SkillHive?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1">
                SkillHive is a digital platform that connects talented
                individuals in Nepal with recruiters, mentors, and job
                opportunities through live showcases, chat, skill verification,
                and more.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion sx={{ backgroundColor: "#fff", color: "black", mb: 2 }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2-content"
              id="panel2-header"
            >
              <Typography variant="h6">Who can use SkillHive?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1">
                Students, freelancers, young professionals, employers,
                recruiters, mentors, and educational institutions can all
                benefit from SkillHive.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion sx={{ backgroundColor: "#fff", color: "black", mb: 2 }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel3-content"
              id="panel3-header"
            >
              <Typography variant="h6">
                What problem does SkillHive solve?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1">
                SkillHive addresses the gap in Nepal where talented people lack
                exposure, verified opportunities, and trusted connections to
                mentors and employers.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion sx={{ backgroundColor: "#fff", color: "black", mb: 2 }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel4-content"
              id="panel4-header"
            >
              <Typography variant="h6">
                What features does SkillHive offer?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1">
                Features include live streaming of talent showcases, real-time
                chat, job and event postings, skill tests, verified profiles,
                and mentorship.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion sx={{ backgroundColor: "#fff", color: "black", mb: 2 }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel5-content"
              id="panel5-header"
            >
              <Typography variant="h6">
                How does SkillHive generate revenue?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1">
                Revenue comes from premium features, promoted posts, commissions
                from freelance projects, online course sales, and partnerships
                with educational institutions.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion sx={{ backgroundColor: "#fff", color: "black", mb: 2 }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel6-content"
              id="panel6-header"
            >
              <Typography variant="h6">
                Is SkillHive accessible throughout Nepal?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1">
                Yes, SkillHive is designed to be mobile-friendly and localized,
                making it accessible anywhere in Nepal.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion sx={{ backgroundColor: "#fff", color: "black", mb: 2 }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel7-content"
              id="panel7-header"
            >
              <Typography variant="h6">
                What are SkillHive’s future plans?
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body1">
                Future plans include AI-powered talent matching, SkillHive
                Academy for learning, verified freelance marketplace, global
                expansion, and blockchain-based skill portfolios.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Box>
      </Container>
    </>
  );
}
