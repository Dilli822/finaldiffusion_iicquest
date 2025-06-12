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
import HopeLight from "../assets/img/mix/IdeaHopeLight.jpg"
import Community from "../community/Community";


export default function LandingPage() {
  return (
    <>
      {/* <Emergency /> */}
      {/* <Carousel/> */}
      <Container maxWidth={"lg"}>
        <Grid
          container
          mt={"5rem"}
          style={{ display: "flex", alignItems: "center" }}
        >
          <Grid item md={7}>
          <Typography gutterBottom sx={{ fontSize: "48px", fontWeight: "" }}>
           SkillHive
          </Typography>

          <Typography gutterBottom sx={{ fontSize: "32px", fontWeight: "" }}>
            The Hive Where Talents & Skill Thrive
          </Typography>
          </Grid>

          <Grid item md={5}>
            Talented individuals in Nepal often lack exposure, trusted platforms, and access to the right opportunities. There's a gap in connecting talents directly with recruiters, mentors, or project hosts, leading to underused potential.
          </Grid>
        {/* Add content inside the Grid if needed */}
        </Grid>
        <br />
        <br />
        <br />
        <br />
        {/* <Join /> */}
 
        <br />
        <br />
        <br />
        {/* <Widget /> */}
        <hr/>
        <br />
        {/* <DoctorsList /> */}
        <br />
        <br />
        {/* <EmergencySupport/> */}
        <br />
        <br />
        <Grid container spacing={2} alignItems="center" padding={4}>
        <Grid
          item
          xs={12}
          md={7}
          sx={{ display: "flex", justifyContent: "center" }}
        >
          
   
        </Grid>
        <Grid item xs={12} md={12}>
        
           <Community/>
    
          <Typography variant="body1" gutterBottom>
          
          </Typography>

          <br />
        </Grid>
      </Grid>
      
        <br />
        <br />
        <br />
       
 
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
            SkillHive is a digital platform that connects talented individuals in Nepal with recruiters, mentors, and job opportunities through live showcases, chat, skill verification, and more.
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
            Students, freelancers, young professionals, employers, recruiters, mentors, and educational institutions can all benefit from SkillHive.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion sx={{ backgroundColor: "#fff", color: "black", mb: 2 }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3-content"
          id="panel3-header"
        >
          <Typography variant="h6">What problem does SkillHive solve?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1">
            SkillHive addresses the gap in Nepal where talented people lack exposure, verified opportunities, and trusted connections to mentors and employers.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion sx={{ backgroundColor: "#fff", color: "black", mb: 2 }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel4-content"
          id="panel4-header"
        >
          <Typography variant="h6">What features does SkillHive offer?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1">
            Features include live streaming of talent showcases, real-time chat, job and event postings, skill tests, verified profiles, and mentorship.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion sx={{ backgroundColor: "#fff", color: "black", mb: 2 }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel5-content"
          id="panel5-header"
        >
          <Typography variant="h6">How does SkillHive generate revenue?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1">
            Revenue comes from premium features, promoted posts, commissions from freelance projects, online course sales, and partnerships with educational institutions.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion sx={{ backgroundColor: "#fff", color: "black", mb: 2 }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel6-content"
          id="panel6-header"
        >
          <Typography variant="h6">Is SkillHive accessible throughout Nepal?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1">
            Yes, SkillHive is designed to be mobile-friendly and localized, making it accessible anywhere in Nepal.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion sx={{ backgroundColor: "#fff", color: "black", mb: 2 }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel7-content"
          id="panel7-header"
        >
          <Typography variant="h6">What are SkillHive’s future plans?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1">
            Future plans include AI-powered talent matching, SkillHive Academy for learning, verified freelance marketplace, global expansion, and blockchain-based skill portfolios.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Box>
      </Container>
    </>
  );
}
