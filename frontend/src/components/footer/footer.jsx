import React from "react";
import { Box, Typography, Link, Grid, Container } from "@mui/material";
import XIcon from "@mui/icons-material/X";
import FacebookIcon from "@mui/icons-material/Facebook";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

function AppFooter() {
  const currentYear = new Date().getFullYear();
  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: "#222222",
        color: "white",
        py: 3,
        mt: "auto",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="body1" align="center">
              Developed By SGC Innovation
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2" align="center" component="div">
              <Link href="#" color="inherit" underline="none" sx={{ mx: 2 }}>
                Home
              </Link>
              <Link href="#" color="inherit" underline="none" sx={{ mx: 2 }}>
                About Us
              </Link>
              <Link href="#" color="inherit" underline="none" sx={{ mx: 2 }}>
                Contact Us
              </Link>
              <Link href="#" color="inherit" underline="none" sx={{ mx: 2 }}>
                FAQ
              </Link>
              <Link href="#" color="inherit" underline="none" sx={{ mx: 2 }}>
                Terms and Conditions
              </Link>
              <Link href="#" color="inherit" underline="none" sx={{ mx: 2 }}>
                Privacy Policy
              </Link>
            </Typography>
          </Grid>

          <Grid item xs={12} sx={{ textAlign: "center", mt: 1 }}>
            <Link href="#" color="inherit" sx={{ mx: 1 }}>
              <XIcon />
            </Link>
            <Link href="#" color="inherit" sx={{ mx: 1 }}>
              <FacebookIcon />
            </Link>
            <Link href="#" color="inherit" sx={{ mx: 1 }}>
              <WhatsAppIcon />
            </Link>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2" align="center">
              &copy; {currentYear} All Right Reserved
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default AppFooter;
