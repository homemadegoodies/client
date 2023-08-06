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
import { GoogleLogin } from "react-google-login";
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

  const responseGoogle = (response) => {
    console.log(response);
    setGoogleIdToken(response.tokenId);
    setGoogleButtonClicked(true);

    const decodedToken = jwtDecode(response.tokenId);
    const email = decodedToken.email;

    if (googleButtonClicked) {
      Promise.all([checkIfUserIsCustomer(email), checkIfUserIsVendor(email)])
        .then(([isUserCustomer, isUserVendor]) => {
          if (isUserCustomer || isUserVendor) {
            if (isUserCustomer) {
              setContext({
                ...context,
                isCustomerLoggedIn: true,
              });
              navigate("/customer/home");
            } else {
              setContext({
                ...context,
                isVendorLoggedIn: true,
              });
              navigate("/vendor/home");
            }
          } else {
            setSelectedRole("");
            setOpen(true);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  const handleRoleSelection = (role) => {
    setSelectedRole(role);
  };

  const performLogin = () => {
    setOpen(false);

    const decodedCredential = jwtDecode(googleResponse.credential);

    const userData = {
      email: decodedCredential.email,
      firstName: decodedCredential.given_name,
      lastName: decodedCredential.family_name,
      googleIdToken: googleIdToken,
      profilePicture: decodedCredential.picture,
      role: selectedRole,
    };

    const endpoint =
      selectedRole === "customer"
        ? ENDPOINTS.loginGoogleCustomer
        : ENDPOINTS.loginGoogleVendor;

    // Perform the login API call based on the selected role
    createAPIEndpoint(endpoint)
      .post(userData)
      .then((res) => {
        if (res.data.statusCode === 1) {
          // Update the context based on the selected role
          if (selectedRole === "customer") {
            setContext({
              ...context,
              customer: res.data.result,
              isCustomerLoggedIn: true,
            });
            navigate("/customer/home");
          } else if (selectedRole === "vendor") {
            setContext({
              ...context,
              vendor: res.data.result,
              isVendorLoggedIn: true,
            });
            navigate("/vendor/home");
          }
        } else {
          setMessage(res.data.message);
        }
      })
      .catch((err) => console.log(err));

    handleRoleSelection(selectedRole);
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
        <GoogleLogin
          clientId="501127864045-ft33hrmuga70sircjvcemeu2g85g55no.apps.googleusercontent.com"
          onSuccess={responseGoogle}
          onFailure={responseGoogle}
          buttonText="Login with Google"
        />
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
            <Button onClick={() => performLogin("customer")}>Customer</Button>
            <Button onClick={() => performLogin("vendor")}>Vendor</Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </div>
  );
}
