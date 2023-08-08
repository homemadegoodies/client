import React, { useState } from "react";
import { useNavigate } from "react-router";
import useStateContext from "../hooks/useStateContext";
import { createAPIEndpoint, ENDPOINTS } from "../api";
import {
  Stack,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import Register from "../components/auth/Register";
import Login from "../components/auth/Login";
import useStyles from "../hooks/useStyles";
import { GoogleLogin } from "@react-oauth/google";
import jwtDecode from "jwt-decode";

export default function AccountView() {
  const classes = useStyles();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const { context, setContext } = useStateContext();
  const [selectedRole, setSelectedRole] = useState("");
  const [googleIdToken, setGoogleIdToken] = useState("");
  const [googleResponse, setGoogleResponse] = useState(null);
  const [googleButtonClicked, setGoogleButtonClicked] = useState(false);

  const checkIfUserIsCustomer = (email) => {
    return createAPIEndpoint(ENDPOINTS.customers)
      .fetchAll()
      .then((res) => {
        const customerData = res.data.result;
        return customerData && customerData.some((c) => c.email === email);
      })
      .catch((err) => {
        console.log(err);
        return false;
      });
  };

  const checkIfUserIsVendor = (email) => {
    return createAPIEndpoint(ENDPOINTS.vendors)
      .fetchAll()
      .then((res) => {
        const vendorData = res.data.result;
        return vendorData && vendorData.some((v) => v.email === email);
      })
      .catch((err) => {
        console.log(err);
        return false;
      });
  };

  const responseGoogle = async (response) => {
    try {
      setGoogleIdToken(response.credential);
      const decodedCredential = jwtDecode(response.credential);
      setGoogleResponse(decodedCredential);

      const email = decodedCredential.email;
      const isCustomer = await checkIfUserIsCustomer(email);
      const isVendor = await checkIfUserIsVendor(email);

      if (isCustomer) {
        await performGoogleLogin(ENDPOINTS.loginGoogleCustomer);
        navigate("/customer/home");
      } else if (isVendor) {
        await performGoogleLogin(ENDPOINTS.loginGoogleVendor);
        navigate("/vendor/home");
      } else {
        setOpen(true);
      }
    } catch (error) {
      console.error("Google login error:", error);
      setMessage("Error during Google login.");
    }
  };

  const handleRoleSelection = (role) => {
    setSelectedRole(role);
  };

  const performGoogleLogin = async (endpoint) => {
    setOpen(false);

    handleRoleSelection(selectedRole);

    const googleUser = {
      email: googleResponse.email,
      username: googleResponse.email.split("@")[0],
      firstName: googleResponse.given_name,
      lastName: googleResponse.family_name,
      googleIdToken: googleIdToken,
      profilePicture: googleResponse.picture,
      role: selectedRole,
    };

    try {
      const res = await createAPIEndpoint(endpoint).post(googleUser);
      if (res.data.statusCode === 1) {
        const roleKey =
          endpoint === ENDPOINTS.loginGoogleCustomer ? "customer" : "vendor";
        setContext({
          ...context,
          [roleKey]: res.data.result,
          [`is${
            roleKey.charAt(0).toUpperCase() + roleKey.slice(1)
          }LoggedIn`]: true,
        });
      } else {
        setMessage(res.data.message);
      }
    } catch (error) {
      console.error("Google login API error:", error);
      setMessage("Error during Google login.");
    }
  };

  return (
    <div>
      <Typography variant="h4" className={classes.formHeading}>
        Account
      </Typography>
      <br />

      <Typography variant="h6" align="center" color="text.secondary" paragraph>
        Please login or register to access your account.
      </Typography>

      <Stack sx={{ p: 2 }} direction="row" spacing={2} justifyContent="center">
        <GoogleLogin onSuccess={responseGoogle} onFailure={responseGoogle} />
      </Stack>

      <Stack sx={{ p: 2 }} direction="row" spacing={2} justifyContent="center">
        <Login />
        <Register />
      </Stack>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Select Role</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please select the role you want to log in as.
          </DialogContentText>
          <DialogActions>
            <Button
              onClick={() => performGoogleLogin(ENDPOINTS.loginGoogleCustomer)}
            >
              Customer
            </Button>
            <Button
              onClick={() => performGoogleLogin(ENDPOINTS.loginGoogleVendor)}
            >
              Vendor
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </div>
  );
}
