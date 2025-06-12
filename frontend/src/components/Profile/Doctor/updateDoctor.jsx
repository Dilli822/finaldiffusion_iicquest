import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Card,
  Typography,
  Button,
  Modal,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

const DoctorProfileUpdate = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [readOnly, setReadOnly] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    address: "",
    phone_number: "",
    partnership_number: "",
    partner_names: [],
    bio: "",
  });
  const [profileImage, setProfileImage] = useState(null); // State for the new profile image

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    const url = "http://localhost:8000/sushtiti/account/doctors/self"; // Your API endpoint

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
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
          partnership_number: data[0].partnership_number,
          partner_names: data[0].partner_names,
          bio: data[0].bio,
        });
      } else {
        console.error("Failed to fetch profile data");
        setProfileData(null);
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
      setProfileData(null);
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
    setReadOnly(!readOnly); // Toggle editing
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]:
        name === "partner_names"
          ? value.split(",").map((item) => item.trim())
          : value,
    }));
  };

  const handleImageChange = (event) => {
    setProfileImage(event.target.files[0]); // Set the selected image
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const doctorId = profileData.doctor_id;
    const url = `http://localhost:8000/sushtiti/account/doctors/edit/${doctorId}/`;

    // Create FormData to handle file upload
    const formDataToSend = new FormData();
    formDataToSend.append("username", formData.username);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("address", formData.address);
    formDataToSend.append("phone_number", formData.phone_number);
    formDataToSend.append("partnership_number", formData.partnership_number);
    formData.partner_names.forEach((name) =>
      formDataToSend.append("partner_names", name)
    );
    formDataToSend.append("bio", formData.bio);
    if (profileImage) {
      formDataToSend.append("image", profileImage); // Append the image file
    }

    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: formDataToSend,
      });

      if (response.ok) {
        const updatedData = await response.json();
        setProfileData(updatedData);
        setReadOnly(true); // Disable editing after submission
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
    <>
      <Card
        style={{
          padding: "24px",
          maxWidth: "400px",
          margin: "24px auto",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          borderRadius: "8px",
        }}
      >
        <Typography variant="h5">Talent's Profile</Typography>
        <Typography variant="p">
          #Talent Seeker ID: {profileData.doctor_id} 
          {/* | #User ID: {profileData.user} */}
        </Typography>

        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          style={{ marginTop: "12px" }}
        >
          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
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

            {/* Conditionally Render File Input for Profile Image */}
            {!readOnly && (
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ marginBottom: "16px" }}
              />
            )}

            <TextField
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              inputProps={{
                readOnly: readOnly,
              }}
              InputProps={{
                style: {
                  color: readOnly ? "#000" : "darkgreen",
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
              inputProps={{
                readOnly: readOnly,
              }}
              InputProps={{
                style: {
                  color: readOnly ? "#000" : "darkgreen",
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
              inputProps={{
                readOnly: readOnly,
              }}
              InputProps={{
                style: {
                  color: readOnly ? "#000" : "darkgreen",
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
              inputProps={{
                readOnly: readOnly,
              }}
              InputProps={{
                style: {
                  color: readOnly ? "#000" : "darkgreen",
                },
              }}
            />
            <TextField
              label="Partnership No."
              name="partnership_number"
              value={formData.partnership_number}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              inputProps={{
                readOnly: readOnly,
              }}
              InputProps={{
                style: {
                  color: readOnly ? "#000" : "darkgreen",
                },
              }}
            />
            <TextField
              label="Partnership names"
              name="partner_names"
              value={formData.partner_names}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              inputProps={{
                readOnly: readOnly,
              }}
              InputProps={{
                style: {
                  color: readOnly ? "#000" : "darkgreen",
                },
              }}
                 multiline
            />

            <TextField
              label="Bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              multiline
              inputProps={{
                readOnly: readOnly,
              }}
              InputProps={{
                style: {
                  color: readOnly ? "#000" : "darkgreen",
                },
              }}
            />
            <Box display="flex" justifyContent="space-between" marginTop={0}>
              {/* Conditionally Render Submit Button */}
              {!readOnly && (
                <Button type="submit" variant="contained" color="primary">
                  Save Changes
                </Button>
              )}
            </Box>
            <br />
            <Button
              variant="contained"
              color={readOnly ? "primary" : "secondary"}
              onClick={handleEdit} // Toggle edit mode
            >
              {readOnly ? "Edit Profile" : "Cancel Edit"}
            </Button>
          </form>
        </Box>
        <br />
        <Button variant="contained" color="secondary" onClick={handleLogout}>
          Logout
        </Button>
      </Card>

      {/* Updated Logout Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to logout?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLogoutConfirm} color="primary">
            Yes
          </Button>
          <Button onClick={() => setOpen(false)} color="secondary">
            No
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DoctorProfileUpdate;
