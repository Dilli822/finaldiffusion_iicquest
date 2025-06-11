import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
} from "@mui/material";
import { DateTimePicker } from "@mui/lab";

const FreeTimeSlots = () => {
  const [timeSlots, setTimeSlots] = useState([]);
  const [displayCount, setDisplayCount] = useState(5);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [appointmentStartTime, setAppointmentStartTime] = useState(null);
  const [appointmentEndTime, setAppointmentEndTime] = useState(null);
  const [startDate, setStartDate] = useState(""); // State for selected start date
  const [startTime, setStartTime] = useState(""); // State for selected start time
  const [endDate, setEndDate] = useState(""); // State for selected end date
  const [endTime, setEndTime] = useState(""); // State for selected end time
  const [appointMentDoctors, setAppointMentDoctors] = useState("");
  // for refreshing the api call after successful reserve
  const [key, setKey] = useState(0); // Add this state to your component


  useEffect(() => {
    fetchTimeSlots();
  }, []);

  const fetchTimeSlots = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/sushtiti/account/doctor/free-time-slots/list/",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch time slots");
      }

      const data = await response.json();
      setTimeSlots(data);
      setAppointMentDoctors(data[0].user);
      console.log(data[0].user);
    } catch (error) {
      console.error("Error fetching time slots:", error);
    }
  };

  const handlePlaceAppointment = (slot) => {
    setSelectedSlot(slot);
    setAppointmentStartTime(new Date(slot.start_time));
    setAppointmentEndTime(new Date(slot.end_time));
    setConfirmationOpen(true);
  };

  const confirmAppointmentPlacement = async () => {
    try {
      // Check if start and end dates are within the allowed range
      if (
        !(
          new Date(`${startDate}T${startTime}:00.000Z`) >=
            appointmentStartTime &&
          new Date(`${endDate}T${endTime}:00.000Z`) <= appointmentEndTime
        )
      ) {
        throw new Error(
          `Selected appointment dates must be within the range ${
            appointmentStartTime
              ? `${
                  new Date(appointmentStartTime).toISOString().split("T")[0]
                } | ${(() => {
                  const timeString = new Date(appointmentStartTime)
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
                })()}`
              : ""
          } to ${
            appointmentEndTime
              ? `${
                  new Date(appointmentEndTime).toISOString().split("T")[0]
                } | ${(() => {
                  const timeString = new Date(appointmentEndTime)
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
                })()}`
              : ""
          }`
        );
      }

      const userId = localStorage.getItem("userId");
      const doctorOrTeacherId = selectedSlot.doctor_or_teacher;

      // Fetch existing appointments for the user
      const existingAppointments = await fetchAppointments();

      // Check if user already has an appointment on the same day
      const selectedDate = new Date(
        selectedSlot.start_time
      ).toLocaleDateString();
      const hasExistingAppointment = existingAppointments.some(
        (appointment) => {
          const appointmentDate = new Date(
            appointment.start_time
          ).toLocaleDateString();
          return (
            appointment.user === parseInt(userId) &&
            appointmentDate === selectedDate
          );
        }
      );

      if (hasExistingAppointment) {
        throw new Error(
          "Cannot place appointment. You already have an appointment on the same day."
        );
      }

      const postData = {
        time_slot_id: selectedSlot.id,
        free_time_slot: selectedSlot.id,
        user: parseInt(userId),
        doctor: selectedSlot.user,
        booked_startDateTime: `${startDate}T${startTime}:00.000Z`, // Include selected start date-time
        booked_endDateTime: `${endDate}T${endTime}:00.000Z`, // Include selected end date-time
      };

      // Log the posted data
console.log("Data being posted:", postData);

      // Proceed to place appointment if no conflict
      const responsePlacement = await fetch(
        "http://localhost:8000/sushtiti/account/users/appointments-to-doctor/create/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify(postData),

   
          
        }
      );

      if(responsePlacement.ok){
        console.log("Data being posted:", postData);
        alert(postData)
        
        window.location.reload(); // This will reload the entire page
    
      }

      if (!responsePlacement.ok) {
        throw new Error("Failed to place appointment");
      }

      setSnackbarMessage("Appointment placed successfully");
      setSnackbarOpen(true);
      setConfirmationOpen(false);
      // window.location.reload();
    } catch (error) {
      console.error("Error placing appointment:", error);
      // Display error message to user, e.g., using Snackbar or any other UI component
      setSnackbarMessage(error.message);
      setSnackbarOpen(true);
    }
  };

  useEffect(() => {
    // This effect runs after snackbarOpen or confirmationOpen changes
    if (snackbarOpen || confirmationOpen) {
      fetchTimeSlots(); // Refresh time slots if snackbar or confirmation is open
    }
  }, [snackbarOpen, confirmationOpen]);

  const fetchAppointments = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/sushtiti/account/users/appointments-to-doctor/list/",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch existing appointments");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching existing appointments:", error);
      throw new Error("Failed to fetch existing appointments");
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleCloseConfirmation = () => {
    setConfirmationOpen(false);
    setSelectedSlot(null);
    setAppointmentStartTime(null);
    setAppointmentEndTime(null);
    setStartDate(""); // Reset selected start date
    setStartTime(""); // Reset selected start time
    setEndDate(""); // Reset selected end date
    setEndTime(""); // Reset selected end time
  };

  const handleViewMore = () => {
    setDisplayCount((prevCount) => prevCount + 5);
  };

  return (
    <Box sx={{ mt: 2 }}>
      <div style={{ display: "flex", alignItems: "baseLine" }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Appoint Your Doctor |
        </Typography>
        &nbsp;
        <Typography variant="h5" component="h2" gutterBottom>
          Doctor's Available DateTime Slots
        </Typography>
      </div>
      <hr />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Doctor's Id: </TableCell>
              <TableCell>Start Time</TableCell>
              <TableCell>End Time</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {timeSlots.slice(0, displayCount).map((slot) => (
              <TableRow key={slot.id}>
                <TableCell>{slot.user}</TableCell>

                <TableCell>
                  {new Date(slot.start_time).toISOString().split("T")[0]} |{" "}
                  {(() => {
                    const timeString = new Date(slot.start_time)
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
                  {new Date(slot.end_time).toISOString().split("T")[0]} |{" "}
                  {(() => {
                    const timeString = new Date(slot.end_time)
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
                  {slot.expired ? "Appointment Expired": "Available"}
                </TableCell>

                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handlePlaceAppointment(slot)}
                    fullWidth
                  >
                    Reserve
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {displayCount < timeSlots.length && (
          <Box textAlign="center" mt={2}>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleViewMore}
            >
              View More
            </Button>
          </Box>
        )}

        <br />
      </TableContainer>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
      />

      <Dialog open={confirmationOpen} onClose={handleCloseConfirmation}>
        <DialogTitle>Confirm Appointment</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to place an appointment from{" "}
            {appointmentStartTime
              ? `${
                  new Date(appointmentStartTime).toISOString().split("T")[0]
                } | ${(() => {
                  const timeString = new Date(appointmentStartTime)
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
                })()}`
              : ""}{" "}
            to{" "}
            {appointmentEndTime
              ? `${
                  new Date(appointmentEndTime).toISOString().split("T")[0]
                } | ${(() => {
                  const timeString = new Date(appointmentEndTime)
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
                })()}`
              : ""}
          </Typography>

          <hr />
          <Typography variant="h6">Start DateTime</Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={5}>
              <TextField
                label="Date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={5}>
              <TextField
                label="Time"
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
          <br />
          <Typography variant="h6">End DateTime</Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={5}>
              <TextField
                label="Date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={5}>
              <TextField
                label="Time"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmation}>Cancel</Button>
          <Button
            onClick={confirmAppointmentPlacement}
            variant="contained"
            color="primary"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FreeTimeSlots;
