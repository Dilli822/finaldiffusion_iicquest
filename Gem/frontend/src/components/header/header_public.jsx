import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Close as CloseIcon } from "@material-ui/icons";
import Notification from "../Notifications/Notifications";
import {
  AppBar,
  Button,
  Container,
  IconButton,
  Drawer,
  List,
  Grid,
  ListItem,
  ListItemText,
  useMediaQuery,
  createTheme, // Import createTheme
} from "@mui/material";

import { ShoppingCart, Search, Notifications } from "@material-ui/icons";
// import HeadLogo from "../assets/logo/e-com logo.jpg";

import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { makeStyles } from "@material-ui/core/styles";
const theme = createTheme(); // Create a theme

const useStyles = makeStyles((theme) => ({
  cartLink: {
    textDecoration: "none",
    color: "red",
    display: "flex",
    alignItems: "center",
  },
  cartIcon: {
    marginRight: theme.spacing(1),
    color: "red", // Change color to red
    // border: "1px solid red", // Add border for outline effect
    borderRadius: "5%", // Optional: To make it circular
    padding: theme.spacing(0.35), // Optional: Adjust padding for spacing
  },
  cartText: {
    fontWeight: "bold",
    color: "red", // Change text color to red
  },
  largeIcon: {
    fontSize: "2.15rem!important", // Adjust the size as needed
    color: theme.palette.primary.secondary, // Change color to match your theme
  },
  searchContainer: {
    display: "flex",
    alignItems: "center",
    width: "100%",
  },
  searchInput: {
    width: "100%",
    background: "#fff!important",
    border: "2px solid #ccc",
    borderRadius: "5px",
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    transition: "border-color 0.3s ease!important",
    "&:hover, &:focus": {
      borderColor: theme.palette.primary.main,
    },
  },

  searchResults: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[3],
    borderRadius: theme.shape.borderRadius,
    overflowY: "auto",
  },
  searchResultItem: {
    padding: theme.spacing(1, 2),
    "&:hover": {
      backgroundColor: theme.palette.action.hover,
    },
  },

  linkBlack: {
    textDecoration: "none",
    color: "black",
  },
}));

const HeaderPublic = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setDrawerOpen(false); // Close drawer on menu item click
  };

  const handleSearchChange = async (event) => {
    const { value } = event.target;
    setSearchText(value);

    if (value.trim() === "") {
      // Close search results if input is empty
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/e-com/api/products/public/list/?search=${value}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch search results");
      }
      const data = await response.json();

      // Filter the data based on the search input
      const filteredResults = Object.keys(data).reduce((acc, category) => {
        const filteredCategory = data[category].filter((product) =>
          product.product_name.toLowerCase().includes(value.toLowerCase())
        );
        if (filteredCategory.length > 0) {
          acc[category] = filteredCategory;
        }
        return acc;
      }, {});

      setSearchResults(filteredResults);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  const closeSearch = () => {
    setSearchText("");
    setSearchResults([]);
  };

  const isDoctor = localStorage.getItem("is_doctor") === "true";
  const is_mediatationTeacher =
    localStorage.getItem("is_mediatationTeacher") === "true";
  const AnnoyUser = localStorage.getItem("is_annoymousUser") === "true";

  const profileLink = isDoctor
    ? "/profile/doctor"
    : is_mediatationTeacher
    ? "/profile/mediator-teacher"
    : "/profile/user";

  const menuItems = (
    <List>
      <ListItem button onClick={handleClose}>
        <Link
          to="/cart/details/"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <ListItemText primary="Cart" />
        </Link>
      </ListItem>
      <ListItem button onClick={handleClose}>
        <Link
          to={profileLink}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <ListItemText primary="Profile" />
        </Link>
      </ListItem>
    </List>
  );

  return (
    <>
      <AppBar position="sticky" sx={{ bgcolor: "#FFFFFF", color: "#000" }}>
        <Container maxWidth={"lg"}>
          <Grid
            container
            style={{ display: "flex", alignItems: "center" }}
            id="mobileNav"
          >
            <Grid item xs={6}>
              <Link to="/">
                <img
                  src="https://raw.githubusercontent.com/aakashstha1/Susthiti/main/Logo.png"
                  alt=""
                  style={{ width: "150px" }}
                />
              </Link>
            </Grid>

            <Grid item xs={6}>
              <Grid
                container
                style={{ display: "flex", justifyContent: "flex-end" }}
              >
                <Grid item>
                  <Link to="/aptitude-test" underline="none">
                    <Button
                      variant="text"
                      sx={{
                        color: "#000",
                        textTransform: "none",
                        "&:hover": {
                          backgroundColor: "transparent",
                        },
                      }}
                    >
                      Apitutde Test 🩺
                    </Button>
                  </Link>
                </Grid>

                <Grid item>
                  <Link to="/community" underline="none">
                    <Button
                      variant="text"
                      sx={{
                        color: "#000",
                        textTransform: "none",
                        "&:hover": {
                          backgroundColor: "transparent",
                        },
                      }}
                    >
                      Join Our Community 💬
                    </Button>
                  </Link>
                </Grid>

                <Grid item>
                  <Grid item>
                    {localStorage.getItem("accessToken") ? (
                      <Link to={profileLink} underline="none">
                        <Button
                          variant="text"
                          sx={{
                            color: "#000",
                            textTransform: "none",
                            "&:hover": {
                              backgroundColor: "transparent",
                            },
                          }}
                        >
                          Profile
                        </Button>
                      </Link>
                    ) : (
                      <Link to="/login" underline="none">
                        <Button
                          variant="text"
                          sx={{
                            color: "#000",
                            textTransform: "none",
                            "&:hover": {
                              backgroundColor: "transparent",
                            },
                          }}
                        >
                          Login/Signup
                        </Button>
                      </Link>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Container>
            {isMobile && (
              <Grid container>
                <Grid item xs={6}>
                  <img
                    src="https://raw.githubusercontent.com/aakashstha1/Susthiti/main/Logo.png"
                    alt=""
                    style={{ width: "150px" }}
                  />
                </Grid>

                <Grid item xs={6}>
                  <div style={{ float: "right" }}>
                    <IconButton
                      color="inherit"
                      aria-label="open drawer"
                      edge="start"
                      onClick={toggleDrawer}
                    >
                      <MenuIcon />
                    </IconButton>
                  </div>
                </Grid>
              </Grid>
            )}
          </Container>
        </Container>
      </AppBar>
      <Container>
        <Grid container>
          <Grid
            item
            xs={10}
            style={{ zIndex: 999, width: "100%", position: "fixed" }}
          ></Grid>
        </Grid>
      </Container>

      {isMobile && (
        <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer}>
          <div
            role="presentation"
            onClick={toggleDrawer}
            onKeyDown={toggleDrawer}
          >
            {menuItems}
          </div>
        </Drawer>
      )}
    </>
  );
};

export default HeaderPublic;
