import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Grid,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Avatar,
} from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import HelpIcon from "@mui/icons-material/Help";
import EmergencyShareIcon from '@mui/icons-material/EmergencyShare';
import MedicalServicesOutlinedIcon from '@mui/icons-material/MedicalServicesOutlined';
import MedicationIcon from '@mui/icons-material/Medication';

const doctors = [
  {
    id: 1,
    name: "Dr. John Doe",
    specialty: "Cardiologist",
    profilePic: "https://example.com/doctor1.jpg",
  },
  {
    id: 2,
    name: "Dr. Jane Smith",
    specialty: "Orthopedist",
    profilePic: "https://example.com/doctor2.jpg",
  },
  {
    id: 3,
    name: "Dr. Emily Johnson",
    specialty: "Dermatologist",
    profilePic: "https://example.com/doctor3.jpg",
  },
  {
    id: 4,
    name: "Dr. Michael Brown",
    specialty: "Pediatrician",
    profilePic: "https://example.com/doctor4.jpg",
  },
  {
    id: 5,
    name: "Dr. Sarah Wilson",
    specialty: "Neurologist",
    profilePic: "https://example.com/doctor5.jpg",
  },
];

const EmergencySupport = () => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleViewMore = () => {
    alert("Viewing more doctors...");
    // Implement the actual logic to view more doctors, e.g., navigating to another page
  };

  return (
    <Card sx={{ margin: 2 }}>
      <CardContent>

        <Grid container style={{ display: "flex", alignItems: "center" }}>
          <Grid item md={8}>


<MedicalServicesOutlinedIcon color="error" style={{ fontSize: "5em" }} />
          <Typography variant="h4">
            Emergency Support <HelpIcon color="error" style={{ fontSize: "1.25em" }} />
          </Typography>

        <Typography variant="body1" mb={2}>
          If you need immediate assistance, please use one of the following
          options to contact our support team.
        </Typography>
          </Grid>

          <Grid item md={4}>
            <Grid>
            <Button
              variant="contained"
              color="error"
              startIcon={<PhoneIcon />}
              fullWidth
              onClick={handleClickOpen}
            >
              Call Us
            </Button>
      
            </Grid>

            <Grid mt={1}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<EmailIcon />}
              fullWidth
              onClick={handleClickOpen}
            >
              Email Us
            </Button>
            </Grid>


          </Grid>


        </Grid>

        
      </CardContent>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Contact Emergency Support</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Select your preferred method of contact and we will assist you as
            soon as possible.
          </DialogContentText>
          <Box display="flex" justifyContent="space-around" mt={2}>
            <IconButton
              color="error"
              onClick={() => (window.location.href = "tel:+123456789")}
            >
              <PhoneIcon fontSize="large" />
            </IconButton>
            <IconButton
              color="secondary"
              onClick={() =>
                (window.location.href = "mailto:support@example.com")
              }
            >
              <EmailIcon fontSize="large" />
            </IconButton>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default EmergencySupport;
