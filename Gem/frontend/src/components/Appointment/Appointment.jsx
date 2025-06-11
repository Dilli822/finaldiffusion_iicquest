import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Modal,
  Paper,
  IconButton,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";

const Appointment = () => {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [slotSaved, setSlotSaved] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [zoomLink, setZoomLink] = useState("");
  const [appointMeetLink, setAppointMeetLink] = useState("");
  const [putRequestBody, setPutRequestBody] = useState(null); // State to hold PUT request body JSON data

  useEffect(() => {
    fetchDoctorSlottedFreeTime();
    fetchAppointments();
  }, []);

  const handleZoomLinkChange = (e) => {
    const inputText = e.target.value;

    // Regular expression to match Google Meet link
    const meetLinkRegex = /https:\/\/meet\.google\.com\/[a-zA-Z0-9-]+/;

    // Extract the Google Meet link if found
    const extractedLink = inputText.match(meetLinkRegex);

    if (extractedLink) {
      setZoomLink(extractedLink[0]); // Set the extracted link to state
    } else {
      // Handle case where no valid Google Meet link is found
      setZoomLink(""); // Clear state or handle accordingly
    }
  };

  const fetchDoctorSlottedFreeTime = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/sushtiti/account/doctor/free-time-slots/list/",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const formattedSlots = data.map((slot) => ({
          id: slot.id,
          start_time: new Date(slot.start_time).toISOString(),
          end_time: new Date(slot.end_time).toISOString(),
        }));
        setAvailableSlots(formattedSlots);
      } else {
        console.error("Failed to fetch doctor's free time slots");
      }
    } catch (error) {
      console.error("Error fetching doctor's free time slots:", error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/sushtiti/account/appointments-to-doctor/list/",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAppointments(data);
      } else {
        console.error("Failed to fetch appointments");
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  const handleAddSlot = async () => {
    const currentDateTime = new Date().toISOString().split("T")[0];

    if (startDate < currentDateTime) {
      alert("Start Date cannot be in the past!");
      console.error("Start date cannot be in the past");
      return;
    }

    const startDateTime = new Date(`${startDate}T${startTime}`);
    const endDateTime = new Date(`${endDate}T${endTime}`);
    const diffInMilliseconds = endDateTime - startDateTime;
    const diffInHours = diffInMilliseconds / (1000 * 60 * 60);

    if (diffInHours < 1) {
      alert("Time interval between start and end must be greater than 1 hour!");
      console.error("Time interval between start and end must be greater than 1 hour");
      return;
    }

    if (startDate && startTime && endDate && endTime) {
      try {
        const response = await fetch(
          "http://localhost:8000/sushtiti/account/doctor/free-time-slots/create/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
            body: JSON.stringify({
              user: localStorage.getItem("userId"),
              start_time: `${startDate}T${startTime}:00`,
              end_time: `${endDate}T${endTime}:00`,
            }),
          }
        );
        if (response.ok) {
          console.log("Slot saved successfully");
          setSlotSaved(true);
          fetchDoctorSlottedFreeTime();
        } else {
          const responseData = await response.json();
          console.error("Failed to save slot:", responseData);
        }
      } catch (error) {
        console.error("Error saving slot:", error);
      } finally {
        setStartDate("");
        setStartTime("");
        setEndDate("");
        setEndTime("");
      }
    }
  };

  const handleDeleteSlot = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:8000/sushtiti/account/doctor/free-time-slots/edit/${id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (response.ok) {
        console.log("Slot deleted successfully");
        setAvailableSlots(availableSlots.filter((slot) => slot.id !== id));
        console.log(availableSlots.filter((slot) => slot.id !== id))
      } else {
        console.error("Failed to delete slot");
      }
    } catch (error) {
      console.error("Error deleting slot:", error);
    }
  };

  const verifyAppointment = async (appointment) => {
    setPutRequestBody({
      ...appointment,
      doctor_verify: true,
    });

    try {
      const response = await fetch(
        `http://localhost:8000/sushtiti/account/users/appointments-to-doctor/${appointment.id}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({
            ...appointment,
            doctor_verify: true,
          }),
        }
      );

      if (response.ok) {
        console.log("Appointment verified successfully");
        fetchAppointments();
        setOpenModal(true);
        setAppointMeetLink(appointment.id); // Set the appointment ID for sending Zoom link
      } else {
        console.error("Failed to verify appointment");
      }
    } catch (error) {
      console.error("Error verifying appointment:", error);
    }
  };

  const handleSendZoomLink = async () => {
    try {
      if (appointMeetLink) {
        const response = await fetch(
          `http://localhost:8000/sushtiti/account/users/appointments-to-doctor/${appointMeetLink}/`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
            body: JSON.stringify({
              ...putRequestBody,
              google_meetLink: zoomLink,
            }),
          }
        );

        if (response.ok) {
          console.log("Google Meet link sent successfully");
          handleCloseModal();
          fetchAppointments();
        } else {
          console.error("Failed to send Google Meet link");
        }
      } else {
        console.error("No appointment ID found to send Google Meet link");
      }
    } catch (error) {
      console.error("Error sending Google Meet link:", error);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setZoomLink("");
  };
  return (
    <Box sx={{ m: 4 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Manage Appointments
      </Typography>

      <Box sx={{ my: 4 }}>
        <Typography variant="h5" component="h3" gutterBottom>
          Add Available Slots
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Start Time"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={6}>
            <TextField
              label="End Date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="End Time"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              required="true"
            />
          </Grid>
        </Grid>
        <Grid item xs={5} sx={{ mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddSlot}
            fullWidth
          >
            Add Your Appoints DateTime
          </Button>
        </Grid>
      </Box>
      <hr />

      <Box sx={{ my: 4 }}>
        <Typography variant="h5" component="h3" gutterBottom>
          Doctor's Free Time Slots
        </Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Start Time</TableCell>
                <TableCell>End Time</TableCell>
                <TableCell>Appointment DateTime Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            
          </Table>
        </TableContainer>
      </Box>
      <hr />
      <Box sx={{ my: 4 }}>
        <Typography variant="h5" component="h3" gutterBottom>
          Appointments
        </Typography>
    
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User ID</TableCell>
                <TableCell>Booked DateTime</TableCell>
                <TableCell>Free Time</TableCell>
                <TableCell>Doctor ID </TableCell>
                <TableCell>   Slot ID</TableCell>
    
                <TableCell>Status</TableCell>
                <TableCell>Google Meet Link </TableCell>
                <TableCell>Action </TableCell>
    
              </TableRow>
            </TableHead>
            <TableBody>
              {appointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>{appointment.user}</TableCell>
                  {/* <TableCell>
                    {new Date(
                      appointment.booked_startDateTime
                    ).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {new Date(appointment.booked_endDateTime).toLocaleString()}
                  </TableCell> */}

<TableCell>
                    {new Date(appointment.booked_startDateTime).toISOString().split("T")[0]} |{" "}
                    {(() => {
                      const timeString = new Date(appointment.booked_startDateTime)
                        .toISOString()
                        .split("T")[1]
                        .split(".")[0];
                      const [hours, minutes] = timeString.split(":");
                      let period = "AM";
                      let hour = parseInt(hours, 10);
                      if (hour >= 12) {
                        period = "PM";
                        if (hour > 12) {
                          hour -= 12;
                        }
                      }
    
                      return `${hour}:${minutes} ${period}`;
                    })()}
                  </TableCell>
    
                  <TableCell>
                    {new Date(appointment.booked_endDateTime).toISOString().split("T")[0]} |{" "}
                    {(() => {
                      const timeString = new Date(appointment.booked_endDateTime)
                        .toISOString()
                        .split("T")[1]
                        .split(".")[0];
                      const [hours, minutes] = timeString.split(":");
                      let period = "AM";
                      let hour = parseInt(hours, 10);
    
                      if (hour >= 12) {
                        period = "PM";
                        if (hour > 12) {
                          hour -= 12;
                        }
                      }
    
                      return `${hour}:${minutes} ${period}`;
                    })()}
                  </TableCell>
                  <TableCell>{appointment.doctor}</TableCell>

                  <TableCell>{appointment.free_time_slot}</TableCell>



                  <TableCell>
                    {appointment.doctor_verify ? "Verified" : "Pending"}
                  </TableCell>
                  <TableCell>
                  <a href={appointment.google_meetLink} target="_blank" rel="noopener noreferrer">
                          Google Meet Link
                        </a>
    </TableCell>
    <TableCell>
                    {!appointment.doctor_verify && (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => verifyAppointment(appointment)}
                      >
                        Verify
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    
      {/* Modal for Zoom link */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="zoom-link-modal-title"
        aria-describedby="zoom-link-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" id="zoom-link-modal-title" gutterBottom>
            Send Google Meet Link
          </Typography>
          <Typography variant="body1" id="zoom-link-modal-description">
            Enter the Google Meet link for the appointment:
          </Typography>
          <br />
          <TextField
            label="Zoom Link"
            value={zoomLink}
            onChange={handleZoomLinkChange}
            fullWidth
            variant="outlined"
            sx={{ mt: 2 }}
          />
          <br />
          <a
            href="https://meet.google.com/"
            target="_blank"
            rel="noopener noreferrer"
 
          >
            Generate Google Meet Link for you and your patient
          </a>
          <br />
    
          <Button
            variant="contained"
            color="primary"
            onClick={handleSendZoomLink}
            sx={{ mt: 2 }}
          >
            Send
          </Button>
        </Box>
      </Modal>
    </Box>
);
};

export default Appointment;