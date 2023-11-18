import React from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Stack,
  IconButton,
  Grid,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import EmailIcon from "@mui/icons-material/Email";
import PersonIcon from "@mui/icons-material/Person";
import { Outlet, useNavigate } from "react-router";
import Footer from "./Footer";

export default function HomeLayout() {
  const navigate = useNavigate();
  const handleHomeClick = () => {
    navigate("/");
  };
  const handleAboutClick = () => {
    navigate("/about");
  };
  const handleContactClick = () => {
    navigate("/contact");
  };

  return (
    <div>
      <AppBar position="relative">
        <Toolbar>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <IconButton
                size="large"
                aria-label="Home"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleHomeClick}
                color="inherit"
              >
                <HomeIcon />
              </IconButton>
            </Grid>
            <Grid item>
              <Typography
                variant="h6"
                noWrap
                sx={{
                  display: { xs: "none", md: "flex" },
                  color: "inherit",
                  textDecoration: "none",
                }}
              >
                Homemade Goodies
              </Typography>
            </Grid>
          </Grid>

          <Stack direction="row" spacing={2}>
            <IconButton
              size="large"
              aria-label="Account"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={() => navigate("/account")}
              color="inherit"
            >
              <PersonIcon />
            </IconButton>
            <IconButton
              size="large"
              aria-label="About"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleAboutClick}
              color="inherit"
            >
              <InfoIcon />
            </IconButton>
            <IconButton
              size="large"
              aria-label="Contact Us"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleContactClick}
              color="inherit"
            >
              <EmailIcon />
            </IconButton>
          </Stack>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          bgcolor: "#f5f5f5",
          minHeight: "100vh",
          py: 6,
        }}
      >
        <Outlet />
        <Footer />
      </Box>
    </div>
  );
}
