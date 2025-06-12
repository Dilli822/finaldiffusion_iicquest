import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  Container,
  Grid,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
} from "@mui/material";

const PaymentPage = () => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [pidx, setPidx] = useState(uuidv4());
  const [showOTPBox, setShowOTPBox] = useState(false); // State to manage OTP box visibility
  const [otpValue, setOtpValue] = useState("");
  const [paymentVerified, setPaymentVerified] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(false); // State to manage submit button disabled state

  const handleSubmit = async (event) => {
    event.preventDefault();

    const requestBody = {
      pidx: pidx,
      mobile: mobileNumber,
      password: password,
    };

    setShowOTPBox(true); // Show OTP box after successful payment
    setSubmitDisabled(true); // Disable submit button after successful payment
    
    try {
      const response = await fetch(
        "https://test-pay.khalti.com/?pidx=3XfWbHK5oxbFB4QatxhkHd",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (response.ok) {
        // Handle success scenario
        console.log("Payment successful!");

      } else {
        // Handle error scenario
        console.error("Payment failed");
      }
    } catch (error) {
      console.error("Error occurred:", error);
    }
  };

  const handleVerifyOTP = () => {
    if (otpValue === "76545") {
      setPaymentVerified(true);
      console.log("OTP verified. Payment successful!");
    } else {
      console.log("Incorrect OTP. Payment verification failed.");
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Grid container spacing={4}>
        {/* Payment Details Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            {/* Payment details content */}
          </Paper>
        </Grid>

        {/* Payment Form Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" color="textSecondary">
              Pay via Khalti Wallet
            </Typography>
            <Box mt={2} component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Khalti Mobile Number"
                variant="outlined"
                margin="normal"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
              />
              <TextField
                fullWidth
                label="Khalti Password / PIN"
                type="password"
                variant="outlined"
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                type="submit"
                disabled={submitDisabled}
              >
                Submit
              </Button>

              {/* OTP Box */}
              {showOTPBox && !paymentVerified && (
                <>
                  <TextField
                    fullWidth
                    label="Enter OTP"
                    variant="outlined"
                    margin="normal"
                    value={otpValue}
                    onChange={(e) => setOtpValue(e.target.value)}
                  />
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2 }}
                    onClick={handleVerifyOTP}
                  >
                    Verify OTP
                  </Button>
                </>
              )}

              {/* Success Message */}
              {paymentVerified && (
                <Typography variant="body1" sx={{ mt: 2, color: "green" }}>
                  Payment successful!
                </Typography>
              )}

              <Box mt={2} textAlign="center">
                {/* Additional links */}
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      <Box mt={4} textAlign="center">
        <Typography variant="body2">Payment Powered By</Typography>
        <img
          src="https://test-pay.khalti.com/favicons/android-icon-144x144.png"
          alt="Khalti"
          style={{ height: "40px", marginTop: "8px" }}
        />
      </Box>
    </Container>
  );
};

export default PaymentPage;
