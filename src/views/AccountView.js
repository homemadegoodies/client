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

  const responseGoogle = (response) => {
    setGoogleIdToken(response.credential);
    const decodedCredential = jwtDecode(response.credential);
    setGoogleResponse(decodedCredential);
    setGoogleButtonClicked(true);

    const email = decodedCredential.email;

    if (googleButtonClicked) {
      checkIfUserIsCustomer(email).then((isCustomer) => {
        if (isCustomer) {
          createAPIEndpoint(ENDPOINTS.loginGoogleCustomer)
            .fetchAll()
            .then((res) => {
              if (res.data.statusCode === 1) {
                setContext({
                  ...context,
                  customer: res.data.result,
                  isCustomerLoggedIn: true,
                });
                navigate("/customer/home");
              } else {
                setMessage(res.data.message);
              }
            })
            .catch((err) => console.log(err));
        } else {
          checkIfUserIsVendor(email).then((isVendor) => {
            if (isVendor) {
              createAPIEndpoint(ENDPOINTS.loginGoogleVendor)
                .fetchAll()
                .then((res) => {
                  if (res.data.statusCode === 1) {
                    setContext({
                      ...context,
                      vendor: res.data.result,
                      isVendorLoggedIn: true,
                    });
                    navigate("/vendor/home");
                  } else {
                    setMessage(res.data.message);
                  }
                })
                .catch((err) => console.log(err));
            } else {
              setOpen(true);
            }
          });
        }
      });
    }
  };

  const handleRoleSelection = (role) => {
    setSelectedRole(role);
  };

  const performLogin = (role) => {
    setOpen(false);

    // handleRoleSelection(selectedRole);

    const googleUser = {
      email: googleResponse.email,
      username: googleResponse.email.split("@")[0],
      firstName: googleResponse.given_name,
      lastName: googleResponse.family_name,
      googleIdToken: googleIdToken,
      profilePicture: googleResponse.picture,
      role: selectedRole,
    };

    if (role === "customer") {
      createAPIEndpoint(ENDPOINTS.loginGoogleCustomer)
        .post(googleUser)
        .then((res) => {
          if (res.data.statusCode === 1) {
            setContext({
              ...context,
              customer: res.data.result,
              isCustomerLoggedIn: true,
            });
            navigate("/customer/home");
          } else {
            setMessage(res.data.message);
          }
        })
        .catch((err) => console.log(err));
    } else if (role === "vendor") {
      createAPIEndpoint(ENDPOINTS.loginGoogleVendor)
        .post(googleUser)
        .then((res) => {
          setContext({
            ...context,
            vendor: res.data.result,
            isVendorLoggedIn: true,
          });
          if (res.data.statusCode === 1) {
            navigate("/vendor/home");
          } else {
            setMessage(res.data.message);
          }
        })
        .catch((err) => console.log(err));
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
            <Button onClick={() => performLogin("customer")}>Customer</Button>
            <Button onClick={() => performLogin("vendor")}>Vendor</Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </div>
  );
}
