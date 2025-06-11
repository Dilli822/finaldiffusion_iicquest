import React, { useState } from "react";
import {
  Grid,
  Typography,
  Box,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  Avatar,
  TextField,
  Button,
} from "@mui/material";

const MeditatorProfile = () => {
  // Sample data for the instructor
  const instructor = {
    name: "John Doe",
    profilePic: "https://via.placeholder.com/150", // Replace with actual image URL
    contact: "+1234567890",
    address: "1234 Main St, Anytown, USA",
  };

  // State for Zoom meeting details
  const [zoomMeeting, setZoomMeeting] = useState({
    meetingId: "",
    password: "",
  });

  // State for user contact form
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    contact: "",
  });

  // Function to handle form submission
  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic (e.g., API call, validation, etc.)
    console.log("User Name:", userData.name);
    console.log("User Email:", userData.email);
    console.log("User Contact:", userData.contact);
    // Reset form fields
    setUserData({
      name: "",
      email: "",
      contact: "",
    });
  };

  return (
    <Grid container justifyContent="center" spacing={4} sx={{ my: 4 }}>
      <Grid item xs={12} md={10} lg={8}>
        <Typography variant="h3" component="h1" align="center" gutterBottom>
          Meditation Instructor Profile
        </Typography>

        {/* Profile picture, name, contact, and address */}
        <Grid container alignItems="center" spacing={4} mb={4}>
          <Grid item xs={12} md={3} align="center">
            <Avatar
              alt={instructor.name}
              src={instructor.profilePic}
              sx={{ width: 150, height: 150 }}
            />
          </Grid>
          <Grid item xs={12} md={9}>
            <Typography variant="h4" gutterBottom>
              {instructor.name}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Contact: {instructor.contact}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Address: {instructor.address}
            </Typography>
          </Grid>
        </Grid>

        {/* Yoga Training section */}
        <Grid container spacing={4} mb={4}>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 2, height: "100%" }}>
              <Typography variant="h5" gutterBottom>
                Yoga Training
              </Typography>
              <Divider />
              <List sx={{ mt: 2 }}>
                <ListItem>
                  <ListItemText
                    primary="Hatha Yoga Classes"
                    secondary="Monday and Wednesday, 6:00 PM - 7:00 PM"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Vinyasa Flow Yoga"
                    secondary="Tuesday and Thursday, 9:00 AM - 10:00 AM"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Yin Yoga Workshop"
                    secondary="Monthly: Last Saturday, 10:00 AM - 12:00 PM"
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>

          {/* Spiritual Guidance section */}
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 2, height: "100%" }}>
              <Typography variant="h5" gutterBottom>
                Spiritual Guidance
              </Typography>
              <Divider />
              <Box mt={2}>
                <Typography variant="body1">
                  As a spiritual guide, I offer:
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  - Personalized spiritual counseling sessions.
                  <br />
                  - Workshops on spiritual growth and mindfulness.
                  <br />
                  - Study groups on sacred texts and meditation practices.
                  <br />- Online retreats for deepening spiritual practice.
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Community Support section */}
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 2, height: "100%" }}>
              <Typography variant="h5" gutterBottom>
                Community Support
              </Typography>
              <Divider />
              <Box mt={2}>
                <Typography variant="body1">
                  Community support includes:
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  - Weekly group meditation sessions via Zoom.
                  <br />
                  - Online forums and discussion groups for members.
                  <br />
                  - Volunteer opportunities for mindfulness outreach.
                  <br />- Access to resources and guided meditations.
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Zoom Meeting Form */}
        {/* <Grid container spacing={4} my={4}>
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h5" component="h3" gutterBottom>
                Schedule a Zoom Meeting
              </Typography>
              <form onSubmit={handleFormSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      required
                      fullWidth
                      label="Your Name"
                      variant="outlined"
                      value={userData.name}
                      onChange={(e) =>
                        setUserData({
                          ...userData,
                          name: e.target.value,
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      required
                      fullWidth
                      label="Your Contact Number"
                      variant="outlined"
                      value={userData.contact}
                      onChange={(e) =>
                        setUserData({
                          ...userData,
                          contact: e.target.value,
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      label="Your Email"
                      variant="outlined"
                      value={userData.email}
                      onChange={(e) =>
                        setUserData({
                          ...userData,
                          email: e.target.value,
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                    >
                      Send
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>
        </Grid> */}
      </Grid>
    </Grid>
  );
};

export default MeditatorProfile;
