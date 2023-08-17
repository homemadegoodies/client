import React, { useState } from "react";
import {
  Grid,
  TextField,
  Button,
  Alert,
  Card,
  CardContent,
  Typography,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
} from "@mui/material";
import { createAPIEndpoint, ENDPOINTS } from "../../api";

export default function ForgotPassword() {
  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [forgotPasswordSuccessMessage, setForgotPasswordSuccessMessage] =
    useState("");
  const [forgotPasswordErrorMessage, setForgotPasswordErrorMessage] =
    useState("");
  const [resetPasswordSuccessMessage, setResetPasswordSuccessMessage] =
    useState("");
  const [resetPasswordErrorMessage, setResetPasswordErrorMessage] =
    useState("");
  const [open, setOpen] = useState(false);
  const [token, setToken] = useState("");

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const endpoint =
        role === "customer"
          ? ENDPOINTS.forgotCustomerPassword
          : ENDPOINTS.forgotVendorPassword;
      const res = await createAPIEndpoint(endpoint).post({
        username: username,
      });
      if (res.data.statusCode === 1) {
        setForgotPasswordSuccessMessage(res.data.message);
        setToken(res.data.passwordResetToken);
        setOpen(true);
      } else {
        setForgotPasswordErrorMessage(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleResetPasswordConfirm = async (e) => {
    e.preventDefault();
    if (newPassword === confirmPassword) {
      try {
        const endpoint =
          role === "customer"
            ? ENDPOINTS.resetCustomerPassword
            : ENDPOINTS.resetVendorPassword;
        const res = await createAPIEndpoint(endpoint).post({
          token: token,
          password: newPassword,
          confirmPassword: confirmPassword,
        });
        if (res.data.statusCode === 1) {
          setResetPasswordSuccessMessage(res.data.message);
        } else {
          setResetPasswordErrorMessage(res.data);
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      setResetPasswordErrorMessage("Passwords do not match");
    }
  };

  const handleResetPasswordCancel = () => {
    setOpen(false);
    setNewPassword("");
    setConfirmPassword("");
    setForgotPasswordSuccessMessage("");
    setForgotPasswordErrorMessage("");
  };

  return (
    <div className="container">
      <Card
        sx={{
          width: 500,
          margin: "auto",
          padding: 2,
        }}
      >
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Forgot Password
          </Typography>
          <Box sx={{ mt: 2, mb: 2 }}>
            {forgotPasswordErrorMessage && (
              <Alert
                severity="error"
                onClose={() => setForgotPasswordErrorMessage("")}
              >
                {forgotPasswordErrorMessage}
              </Alert>
            )}
            {forgotPasswordSuccessMessage && (
              <Alert
                severity="success"
                onClose={() => setForgotPasswordSuccessMessage("")}
              >
                {forgotPasswordSuccessMessage}
              </Alert>
            )}
          </Box>
          <form onSubmit={handleForgotPassword}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  variant="outlined"
                  label="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  select
                  label="Role"
                  value={role}
                  onChange={handleRoleChange}
                  fullWidth
                  variant="outlined"
                  helperText="Please select your role"
                >
                  <MenuItem value="customer">Customer</MenuItem>
                  <MenuItem value="vendor">Vendor</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" fullWidth>
                  Reset Password
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, mb: 2 }}>
            {resetPasswordErrorMessage && (
              <Alert
                severity="error"
                onClose={() => setResetPasswordErrorMessage("")}
              >
                {resetPasswordErrorMessage}
              </Alert>
            )}
            {resetPasswordSuccessMessage && (
              <Alert
                severity="success"
                onClose={() => setResetPasswordSuccessMessage("")}
              >
                {resetPasswordSuccessMessage}
              </Alert>
            )}
          </Box>
          <form onSubmit={handleResetPasswordConfirm}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  variant="outlined"
                  label="New Password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  variant="outlined"
                  label="Confirm Password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleResetPasswordCancel}>Cancel</Button>
          <Button type="submit" onClick={handleResetPasswordConfirm}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
