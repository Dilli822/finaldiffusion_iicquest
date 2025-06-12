import React from "react";
import { Grid, Typography, Link, Box, Button } from "@mui/material";

const Join = () => {
  return (
    <>
      <hr />

      <Grid container spacing={2} alignItems="center" padding={4}>
        <Grid
          item
          xs={12}
          md={6}
          sx={{ display: "flex", justifyContent: "flex-end" }}
        >
          <Box position="relative" display="inline-block">
            {/* <Box
            sx={{
              position: "absolute",
              bottom: "-4px",
              left: "-4px",
              width: "32rem",
              height: "20rem",
              backgroundColor: "#4FC3F7",
              transform: "rotate(12deg)",
              zIndex: -1,
            }}
          ></Box> */}
            <Box
              component="img"
              // src="https://raw.githubusercontent.com/aakashstha1/Susthiti/main/Group.jpg"
              // src="https://i.pinimg.com/originals/63/fd/ff/63fdff4b7c1964f08c3c16f18f581bd7.gif"
              // src="https://cdn.dribbble.com/users/20368/screenshots/3949907/live_chat_anim_2.gif"

              src="https://i.pinimg.com/originals/e3/1b/75/e31b752875679b64fce009922f9f0dda.gif"
              alt="Placeholder"
              sx={{
                width: "34rem",
                height: "20rem",
                objectFit: "contain",
                borderRadius: "0.75rem",
                zIndex: 1,
                position: "relative",
              }}
            />
          </Box>
        </Grid>

        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "",
            alignItems: "",
            textAlign: "",
            padding: "0 2rem",
          }}
        >
          <Typography variant="h3" gutterBottom>
            Thrive Together: Wellness Hub
          </Typography>
          <Typography variant="body1" gutterBottom>
            Empower yourself to take charge of your mental health. Join a
            supportive community, access valuable resources, and find the
            support you need to thrive in your journey.
          </Typography>

          <Link
            mt={2}
            href="http://localhost:3001/"
            underline="none"
            target="_blank"
            rel="noopener noreferrer"
          >
            {/* #4FC3F7 */}
            <Button variant="contained" sx={{ color: "#fff" }}>
              Join Room
            </Button>
          </Link>
        </Grid>
      </Grid>
    </>
  );
};

export default Join;
