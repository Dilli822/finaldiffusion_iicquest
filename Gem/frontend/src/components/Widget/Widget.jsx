import React from "react";
import { Typography, Button, Grid, Box } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Link } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const theme = createTheme();

const Widget = () => {
  return (
<>
<Grid mt={"3rem"}>
        <hr />
        <Grid
          container
          mt={"1rem"}
          style={{ display: "flex", alignItems: "center" }}
        >
          <Grid item md={8}>
            <Typography
              gutterBottom
              variant="h4"
         
            >
              Games, Exercises & Mediatation
            </Typography>
            <Typography variant="h6">
              Every Step Counts Towards a Healthier You. Be Active, Be Alive.
            </Typography>
            <br />
            <Link to="/engagement">
              <Button
                variant="contained"
                sx={{ mr: 2, backgroundColor: "#4FC3F7" }}
              >
                Play Games
              </Button>
            </Link>
            <Link to="/aptitude-test">
              <Button
                variant="outlined"
                sx={{ mr: 2, borderColor: "#4FC3F7", color: "#000" }}
              >
                Mental Status Exam
              </Button>
            </Link>
          </Grid>

          <Grid item md={4}>
            <Carousel showThumbs={false} infiniteLoop autoPlay>
              <div>
                <img
                  src="https://i.pinimg.com/originals/a7/78/19/a778193d04758b169fca966fe0655645.gif"
                  alt=""
                  style={{ width: "100%", borderRadius: "1%" }}
                />
              </div>
              <div>
                <img
                  src="https://media3.giphy.com/media/OsgloXApFBtFyuFcJV/giphy.gif"
                  alt=""
                  style={{
                    width: "100%",
                    borderRadius: "1%",
                    background: "#fff",
                  }}
                />
              </div>
              <div>
                <img
                  // src="https://cdn.dribbble.com/users/1162077/screenshots/5473505/meditation-animation.gif"
                  //  src="https://i.pinimg.com/originals/a5/71/3e/a5713ede7f4ec30ed8c994edccf02ed3.gif"
                  src="https://mir-s3-cdn-cf.behance.net/project_modules/disp/9c0734100731535.5f0f2ac318fee.gif"
                  alt=""
                  style={{ width: "100%", borderRadius: "1%" }}
                />
              </div>
            </Carousel>
          </Grid>
        </Grid>
      </Grid>

      <br />

    </>
  );
};

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Widget />
    </ThemeProvider>
  );
};

export default App;
