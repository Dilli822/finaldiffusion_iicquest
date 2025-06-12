import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  Typography,
  Button,
  TextField,
  CircularProgress,
  Modal,
} from "@mui/material";
import { Input } from "@material-ui/core";

const AnyUserProfileUpdate = () => {
  const [profileData, setProfileData] = useState({});
  const [profileEditMode, setProfileEditMode] = useState(false);
  const [bio, setBio] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [externalURL, setExternalURL] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [initialProfileData, setInitialProfileData] = useState({});
  const [open, setOpen] = useState(false);
  const [userIds, setUserIds] = useState([]);
  const [resumeFile, setResumeFile] = useState(null);

  const userId = localStorage.getItem("userId");
  const Aaaid = localStorage.getItem("Aid");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/sushtiti/account/users/self",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const ids = data.map((user) => user.annonyuser_id);
        setUserIds(ids);
        setProfileData(data[0]); // Assuming first user object for simplicity
        setInitialProfileData(data[0]);
        setBio(data[0].bio);
        setPhoneNumber(data[0].phone_number);
        setExternalURL(data[0].externalURL);


        localStorage.setItem("Aid", data[0].annonyuser_id); // Ensure Aid is set
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error fetching data");
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setResumeFile(file);
    } else {
      alert("Please select a valid PDF file.");
    }
  };

  const handleLogoutConfirm = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      if (imageFile) {
        formData.append("image", imageFile);
      }
      if (resumeFile) {
        formData.append("resume", resumeFile);
      }
      formData.append("address", profileData.address);
      formData.append("phone_number", profileData.phone_number);
      formData.append("bio", profileData.bio);
      formData.append("externalURL", profileData.externalURL || "");

      if (!Aaaid) {
        throw new Error("Anonymous user ID is missing.");
      }
      const response = await fetch(
        `http://localhost:8000/sushtiti/account/anonymous-users/${Aaaid}/`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: formData,
        }
      );
      if (response.ok) {
        setProfileEditMode(false);
        setMessage("Profile data updated successfully");
      } else {
        setMessage("Failed to update profile data");
      }
    } catch (error) {
      setMessage("Error updating profile data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setProfileData(initialProfileData);
    setProfileEditMode(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditButtonClick = () => {
    setProfileEditMode(true);
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);

    const reader = new FileReader();
    reader.onload = (e) => {
      setProfileData((prevData) => ({
        ...prevData,
        image: e.target.result,
      }));
    };
    reader.readAsDataURL(e.target.files[0]);
  };

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
        <Typography variant="h5">User Profile</Typography>
        <Typography variant="h6">
          User ID: {profileData.annonyuser_id}{" "}
          {/*  |  #User ID: {profileData.user} */}
        </Typography>
        <hr />

        <Box display="flex" flexDirection="column" mt={2}>
          <Box
            display="flex"
            style={{
              width: "200px",
              height: "200px",
              borderRadius: "50%",
              overflow: "hidden",
              position: "relative",
              marginBottom: "16px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            <img
              key={profileData.image}
              src={
                imageFile
                  ? URL.createObjectURL(imageFile)
                  : `${profileData.image}`
              }
              alt="Profile"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />

            {profileEditMode && (
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{
                  position: "absolute",
                  bottom: "8px",
                  right: "8px",
                  zIndex: 1,
                  opacity: 0,
                  cursor: "pointer",
                }}
              />
            )}
          </Box>

          <span>
            <i> Click on the Image to Change the picture. </i>
          </span>
          <hr />
          <br />
          <Typography variant="body1" style={{ marginBottom: "16px" }}>
            <b> Nick Name: </b>
            {profileEditMode ? (
              <TextField
                name="address"
                value={profileData.username || ""}
                onChange={handleInputChange}
                style={{ width: "100%" }}
              />
            ) : (
              <>{profileData.username} </>
            )}
          </Typography>

          <Typography variant="body1" style={{ marginBottom: "16px" }}>
            <b> Profile Tier: </b>
          {profileEditMode ? (
  <TextField
    name="tier"
    value={profileData.tier || "Free Tier"}
    onChange={handleInputChange}
    style={{ width: "100%" }}
  />
) : (
  <>{profileData.tier || "Free Tier"}</>
)}

          </Typography>

          <Typography variant="body1" style={{ marginBottom: "16px" }}>
            <b> Address: </b>
            {profileEditMode ? (
              <TextField
                name="address"
                value={profileData.address || ""}
                onChange={handleInputChange}
                style={{ width: "100%" }}
              />
            ) : (
              <>{profileData.address} </>
            )}
          </Typography>

          <Typography variant="body1" style={{ marginBottom: "16px" }}>
            <b> Phone Number: </b>
            {profileEditMode ? (
              <TextField
                name="phone_number"
                value={profileData.phone_number || ""}
                onChange={handleInputChange}
                style={{ width: "100%" }}
              />
            ) : (
              <> {profileData.phone_number}</>
            )}
          </Typography>

          <Typography
            variant="body1"
            style={{ marginBottom: "16px", textAlign: "left" }}
          >
            <b>Bio & Past Report Records: </b>
            {profileEditMode ? (
              <TextField
                name="bio"
                value={profileData.bio || ""}
                onChange={handleInputChange}
                style={{ width: "100%" }}
                multiline
                rows={7}
              />
            ) : (
              profileData.bio
            )}
          </Typography>

          <Typography
            variant="body1"
            style={{ marginBottom: "16px", textAlign: "left" }}
          >
            <b>Resume: </b>
            {profileEditMode ? (
              <>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file && file.type === "application/pdf") {
                      setResumeFile(file);
                    } else {
                      alert("Please select a valid PDF file.");
                    }
                  }}
                />
                {resumeFile && (
                  <Typography variant="caption" display="block">
                    Selected: {resumeFile.name}
                  </Typography>
                )}
              </>
            ) : resumeFile ? (
              <a
                href={URL.createObjectURL(resumeFile)}
                target="_blank"
                rel="noopener noreferrer"
              >
                {resumeFile.name}
              </a>
            ) : profileData.resume ? (
              <a
                href={profileData.resume}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Resume
              </a>
            ) : (
              <>No resume uploaded.</>
            )}
          </Typography>

          <Typography variant="body1" style={{ marginBottom: "16px" }}>
            <b>website: </b>
            {profileEditMode ? (
              <TextField
                name="externalURL"
                value={profileData.externalURL || ""}
                onChange={handleInputChange}
                style={{ width: "100%" }}
                placeholder="https://yourwebsite.com"
              />
            ) : profileData.externalURL ? (
              <a
                href={profileData.externalURL}
                target="_blank"
                rel="noopener noreferrer"
              >
                {profileData.externalURL}
              </a>
            ) : (
              <>Not provided</>
            )}
          </Typography>

          <div
            style={{
              display: "flex",
              justifyContent: "",
              marginTop: "16px",
              width: "100%",
            }}
          >
            {profileEditMode ? (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSaveProfile}
                  disabled={loading}
                  style={{ marginRight: "8px" }}
                >
                  {loading ? <CircularProgress size={24} /> : "Save"}
                </Button>
                <Button
                  variant="contained"
                  onClick={handleCancelEdit}
                  style={{ marginLeft: "8px" }}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleEditButtonClick}
                  style={{ marginRight: "8px" }}
                >
                  Edit
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleLogout}
                  style={{ marginLeft: "8px" }}
                >
                  Logout
                </Button>
              </>
            )}
          </div>
        </Box>
      </Card>

      <Modal open={open} onClose={handleClose}>
        <Box
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "300px",
            backgroundColor: "#ffffff",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0)",
            padding: "24px",
            outline: "none",
            borderRadius: "8px",
            textAlign: "center",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Are you sure you want to logout?
          </Typography>
          <Box
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "24px",
            }}
          >
            <Button
              variant="contained"
              onClick={handleClose}
              style={{ marginRight: "16px" }}
            >
              Cancel
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={handleLogoutConfirm}
            >
              Logout
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default AnyUserProfileUpdate;
