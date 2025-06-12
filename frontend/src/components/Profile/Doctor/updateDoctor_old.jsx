import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Card,
  Typography,
  Button,
  Modal,
  TextField,
} from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  textField: {
    color: "#000!important", // Default color
  },
  editTextField: {
    color: "darkgreen", // Color when in edit mode
  },
  noEditTextField: {
    color: "#000!important", // Color when not in edit mode
  },
}));
const DoctorProfileUpdate = () => {
  const classes = useStyles(); // Use styles
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    address: "",
    phone_number: "",
    bio: "",
    
  });

  useEffect(() => {
    fetchProfileData();
  }, []);



 

  const fetchProfileData = async () => {
    const url = "http://localhost:8000/sushtiti/account/doctors/self"; // Your API endpoint

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // Use token from local storage
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProfileData(data[0]); // Access the first object in the array
        setFormData({
          username: data[0].username,
          email: data[0].email,
          address: data[0].address,
          phone_number: data[0].phone_number,
          bio: data[0].bio,
        });
        console.log(data[0]); // Log the first object
      } else {
        console.error("Failed to fetch profile data");
        setProfileData(null); // Reset data if fetch fails
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
      setProfileData(null); // Reset data if fetch throws an error
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setOpen(true);
  };

  const handleLogoutConfirm = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };



  
  const handleSubmit = async (event) => {
    event.preventDefault();
    const doctorId = profileData.doctor_id; // Get the doctor_id for the PUT request
    const url = `http://localhost:8000/sushtiti/account/doctors/edit/${doctorId}`; // Edit API endpoint

    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedData = await response.json();
        setProfileData(updatedData); // Update profile data with the new information
        setEditMode(false); // Exit edit mode
      } else {
        console.error("Failed to update profile data");
      }
    } catch (error) {
      console.error("Error updating profile data:", error);
    }
  };

  // Handle loading and no data states
  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (!profileData) {
    return <Typography>No profile data available.</Typography>;
  }

  return (
    <Container>
      <Card
        style={{
          padding: "24px",
          maxWidth: "600px",
          margin: "24px auto",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          borderRadius: "8px",
        }}
      >
        <Typography variant="h5">Doctor's Profile</Typography>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Box
            style={{
              maxWidth: "100%",
              height: "300px",
              borderRadius: "5%",
              overflow: "hidden",
              marginBottom: "16px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            <img
              src={profileData.image || "default_image_url.jpg"} // Default image if no profile image
              alt="Profile"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Box>

          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <TextField
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              className="editModeOff"
              disabled={!editMode}
              InputProps={{
                style: {
                  color: editMode ? "darkgreen" : "#000!important", // Set text color based on edit mode
                },
              }}
            />
            <TextField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              className="editModeOff"
              disabled={!editMode}
              InputProps={{
                style: {
                  color: editMode ? "darkgreen" : "#000!important", // Set text color based on edit mode
                },
              }}
            />
            <TextField
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              disabled={!editMode}
              InputProps={{
                style: {
                  color: editMode ? "darkgreen" : "#000!important", // Set text color based on edit mode
                },
              }}
            />
            <TextField
              label="Phone Number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              className="editModeOff"
              disabled={!editMode}
              InputProps={{
                style: {
                  color: editMode ? "darkgreen" : "#000!important", // Set text color based on edit mode
                },
              }}
            />
            <TextField
              label="Bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              multiline
              rows={4}
              disabled={!editMode}
              className="editModeOff"
              InputProps={{
                style: {
                  color: editMode ? "darkgreen" : "#000!important", // Set text color based on edit mode
                },
              }}
            />

            {editMode ? (
              <>
                <Button variant="contained" type="submit">
                  Save Changes
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setEditMode(false)}
                  style={{ marginLeft: "8px" }}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button variant="contained" onClick={handleEdit}>
                Edit Profile
              </Button>
            )}
          </form>
        </Box>
      </Card>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          style={{
            backgroundColor: "white",
            padding: "16px",
            borderRadius: "8px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            maxWidth: "400px",
            margin: "100px auto",
          }}
        >
          <Typography variant="h6">Confirm Logout</Typography>
          <Typography>Are you sure you want to logout?</Typography>
          <Box display="flex" justifyContent="space-between" marginTop="16px">
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleLogoutConfirm} color="error">
              Logout
            </Button>
          </Box>
        </Box>
      </Modal>
    </Container>
  );
};

export default DoctorProfileUpdate;
