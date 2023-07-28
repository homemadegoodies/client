import React from "react";
import { Stack, Typography } from "@mui/material";
import Register from "../components/auth/Register";
import Login from "../components/auth/Login";
import useStyles from "../hooks/useStyles";

export default function AccountView() {
  const classes = useStyles();

  return (
    <div>
      <Typography variant="h4" className={classes.formHeading}>
        Account
      </Typography>
      <br />

      <Typography variant="h6" align="center" color="text.secondary" paragraph>
        Please login or register to access your account.
      </Typography>
      <Stack sx={{ p: 4 }} direction="row" spacing={2} justifyContent="center">
        <Login />
        <Register />
      </Stack>
    </div>
  );
}
