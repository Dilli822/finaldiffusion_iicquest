import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { Container } from "@material-ui/core";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import CardMedia from "@mui/material/CardMedia";
import DoctorNearby from "../assets/nearby.png";

// Sample Image URLs
const sampleImage = "https://via.placeholder.com/150";

// JSON data
const doctors = [
  {
    id: 1,
    name: "Dr.Pawan Joshi",
    address: "Itahari-6, Bharat Hospital",
    image:
      "https://clinicone.com.np/wp-content/uploads/2020/05/Dr.-Mahesh-Dahal.jpg",
  },

  {
    id: 5,
    name: "Dr.Puspa Raj Giri",
    address: "Buddha Road, Dharan 56700, BPKHIS",
    image:
      "https://bnchospital.edu.np/images/custom/Dr.%20Raju%20SHRESTHA582591047.jpg",
  },
  {
    id: 6,
    name: "Dr.Neena Rai",
    address: "Itahari-9, Life Guard Hospital",
    image:
      "https://rhythmofmymind.com/wp-content/uploads/2022/07/1627917313Dr.-Neena-Rai.jpg",
  },
  {
    id: 7,
    name: "Dr.Priya Shrestha",
    address:
      "Kanchanbari, Biratnagar-5,Nobel Medical College Teaching Hospital",
    image: "https://www.nepalmediciti.com/images/doctors/8790.jpg",
  },
  {
    id: 8,
    name: "Dr.Pranil Rai",
    address: "Buddha Road, Dharan 56700, BPKHIS",
    image: "https://healthhelpline.com.np/assets/upload/doctor-profile-img/pranil_rai.jpg", // Placeholder URL
  },
];
const DoctorsList = () => {
  const [visibleCount, setVisibleCount] = useState(7); // Initial visible count

  const handleViewMore = () => {
    setVisibleCount((prevCount) => prevCount + 5); // Increase visible count by 5
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4">
        Doctors Nearby{" "}
        <img src={DoctorNearby} alt="Doctors Nearby" style={{ width: "40px", height: "40px" }} />
      </Typography>
      <br />
      <Grid container spacing={2}>
        {doctors.slice(0, visibleCount).map((doctor) => (
          <Grid item xs={12} sm={6} md={3} lg={2.35} key={doctor.id}>
            <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
              <CardMedia
                component="img"
                height="200"
                image={doctor.image}
                alt={doctor.name}
              />
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                  {doctor.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {doctor.address}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      {visibleCount < doctors.length && (
        <Box textAlign="center" mt={2}>
          <Button variant="contained" onClick={handleViewMore}>
            View More
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default DoctorsList;