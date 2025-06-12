import { Box, Typography, Button, Grid } from "@mui/material";

function Banner() {
  return (
    <Box
      sx={{
        backgroundImage: `url(https://t3.ftcdn.net/jpg/05/14/95/12/360_F_514951224_2dxMLbIw5qNRdPGD003chpbVcxWtcp7K.jpg)`,
        height: "80vh",
        width: "100%",
        backgroundSize: "cover",

        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
      }}
    >
      <Grid container pl={"50px"}>
        <Grid item md="4">
          <Typography variant="h2" sx={{ color: "#ffffff" }}>
            Welcome to Our Website
          </Typography>
          <Typography variant="body1" sx={{ color: "#ffffff" }}>
            Discover amazing products and services.
          </Typography>
          <Button color="inherit" sx={{ bgcolor: "#4FC3F7", mr: 2 }}>
            Get Started
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Banner;
