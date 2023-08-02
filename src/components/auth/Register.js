import React from "react";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import { createAPIEndpoint, ENDPOINTS } from "../../api";
import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Grid,
  TextField,
  Button,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  MenuItem,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useAuth0 } from "@auth0/auth0-react";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

export default function Register() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const [error, setError] = useState("An error has occured.");
  const [role, setRole] = useState("customer");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const { loginWithRedirect } = useAuth0();

  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    address: "",
    postalCode: "",
    city: "",
    province: "",
  });

  const [errors, setErrors] = useState({});
  const {
    firstName,
    lastName,
    email,
    username,
    password,
    confirmPassword,
    phoneNumber,
    address,
    postalCode,
    city,
    province,
  } = values;
  const {
    firstName: firstNameError,
    lastName: lastNameError,
    email: emailError,
    username: usernameError,
    password: passwordError,
    confirmPassword: confirmPasswordError,
    phoneNumber: phoneNumberError,
    address: addressError,
    postalCode: postalCodeError,
  } = errors;

  const validate = () => {
    let temp = {};
    temp.firstName = /^[A-Z][-a-zA-Z]+$/.test(values.firstName)
      ? ""
      : "Name is not valid. Must be at least 2 characters long and contain only letters. Must start with a capital letter. Cannot contain numbers or special characters.";
    temp.lastName = /^[A-Z][-a-zA-Z]+$/.test(values.lastName)
      ? ""
      : "Name is not valid. Must be at least 2 characters long and contain only letters. Must start with a capital letter. Cannot contain numbers or special characters.";
    temp.email = /.+@.+\.[A-Za-z]+$/.test(values.email)
      ? ""
      : "Email is not valid. Must be in the format: name@email.com or name@email.ca or name@email.co.uk";
    temp.username =
      /^(?=.{5,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/.test(
        values.username
      )
        ? ""
        : "Username is not valid. Must be at least 5 characters long and contain only letters, numbers, periods and underscores. Cannot start or end with a period or underscore. Cannot contain two periods or underscores in a row.";
    temp.password =
      /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{6,}$/.test(
        values.password
      )
        ? ""
        : "Password is not valid. Must contain at least one number, one uppercase and lowercase letter, one special charecter and a minimum length of 6 characters.";
    temp.phoneNumber = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/.test(
      values.phoneNumber
    )
      ? ""
      : "Phone number is not valid. Must be in the format: 123-456-7890 or (123) 456-7890 or 123 456 7890 or 123.456.7890 or +91 (123) 456-7890";
    temp.address =
      /^([\d\s]+\w+)\s(St|Ave|Rd|Blvd|Dr|Cres|Way|Pky|Crt)\s?$/.test(
        values.address
      )
        ? ""
        : "Address is not valid. Must be in the format of: 123 Main St.";
    temp.postalCode = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/.test(
      values.postalCode
    )
      ? ""
      : "Postal code is not valid. Must be in the format of: A1A 1A1 or A1A1A1.";

    setErrors({
      ...temp,
    });
    return Object.values(temp).every((x) => x === "");
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      values.role = role;
      if (role === "vendor") {
        createAPIEndpoint(ENDPOINTS.registerVendor)
          .post(values)
          .then((res) => {
            if (res.data.statusCode === 1) {
              setSuccessMessage("Vendor registered successfully!");
              setShowSuccessAlert(true);
              navigate("/account");
            } else {
              setShowAlert(true);
            }
          })
          .catch((err) => console.log(err));
      }
      if (role === "customer") {
        createAPIEndpoint(ENDPOINTS.registerCustomer)
          .post(values)
          .then((res) => {
            if (res.data.statusCode === 1) {
              setSuccessMessage("Customer registered successfully!");
              setShowSuccessAlert(true);
              navigate("/account");
            } else {
              setShowAlert(true);
            }
          })
          .catch((err) => console.log(err));
      }
    }
  };

  const handleAuth0Register = () => {
    loginWithRedirect({
      screen_hint: "signup",
      login_hint: role,
    });
  };

  // const handleForgetPassword = () => {
  //   navigate("/forget-password");
  // };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const cityOptions = ["Hamilton", "Toronto", "Mississauga"];
  const provinceOptions = ["ON", "AB", "BC"];

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Register
      </Button>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
        >
          Register
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Box sx={{ pt: 0, pb: 4, pr: 2, pl: 2 }}>
            <Grid item xs={12}>
              {showAlert && (
                <Alert severity="error" onClose={handleCloseAlert}>
                  {error}
                </Alert>
              )}
              {showSuccessAlert && (
                <Alert
                  severity="success"
                  onClose={() => setShowSuccessAlert(false)}
                >
                  {successMessage}
                </Alert>
              )}
              <br />
            </Grid>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <TextField
                    required
                    label="First Name"
                    variant="outlined"
                    fullWidth
                    value={firstName}
                    onChange={(e) =>
                      setValues({ ...values, firstName: e.target.value })
                    }
                    error={firstNameError ? true : false}
                    helperText={firstNameError}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    required
                    label="Last Name"
                    variant="outlined"
                    fullWidth
                    value={lastName}
                    onChange={(e) =>
                      setValues({ ...values, lastName: e.target.value })
                    }
                    error={lastNameError ? true : false}
                    helperText={lastNameError}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    label="Email"
                    variant="outlined"
                    fullWidth
                    value={email}
                    onChange={(e) =>
                      setValues({ ...values, email: e.target.value })
                    }
                    error={emailError ? true : false}
                    helperText={emailError}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    label="Username"
                    variant="outlined"
                    fullWidth
                    value={username}
                    onChange={(e) =>
                      setValues({ ...values, username: e.target.value })
                    }
                    error={usernameError ? true : false}
                    helperText={usernameError}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    required
                    label="Password"
                    variant="outlined"
                    fullWidth
                    type="password"
                    value={password}
                    onChange={(e) =>
                      setValues({ ...values, password: e.target.value })
                    }
                    error={passwordError ? true : false}
                    helperText={passwordError}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    required
                    label="Confirm Password"
                    variant="outlined"
                    fullWidth
                    type="password"
                    value={confirmPassword}
                    onChange={(e) =>
                      setValues({
                        ...values,
                        confirmPassword: e.target.value,
                      })
                    }
                    error={confirmPasswordError ? true : false}
                    helperText={confirmPasswordError}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    label="Phone Number"
                    variant="outlined"
                    fullWidth
                    value={phoneNumber}
                    onChange={(e) =>
                      setValues({ ...values, phoneNumber: e.target.value })
                    }
                    error={phoneNumberError ? true : false}
                    helperText={phoneNumberError}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    required
                    label="Address"
                    variant="outlined"
                    fullWidth
                    value={address}
                    onChange={(e) =>
                      setValues({ ...values, address: e.target.value })
                    }
                    error={addressError ? true : false}
                    helperText={addressError}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    required
                    label="Postal Code"
                    variant="outlined"
                    fullWidth
                    value={postalCode}
                    onChange={(e) =>
                      setValues({ ...values, postalCode: e.target.value })
                    }
                    error={postalCodeError ? true : false}
                    helperText={postalCodeError}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    select
                    label="City"
                    value={values.city}
                    fullWidth
                    margin="normal"
                    onChange={(e) =>
                      setValues({ ...values, city: e.target.value })
                    }
                  >
                    {cityOptions.map((city) => (
                      <MenuItem key={city} value={city}>
                        {city}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    label="Province"
                    value={values.province}
                    fullWidth
                    margin="normal"
                    onChange={(e) =>
                      setValues({ ...values, province: e.target.value })
                    }
                  >
                    {provinceOptions.map((province) => (
                      <MenuItem key={province} value={province}>
                        {province}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    select
                    label="Role"
                    value={role}
                    onChange={handleRoleChange}
                    fullWidth
                    margin="normal"
                  >
                    <MenuItem value="customer">Customer</MenuItem>
                    <MenuItem value="vendor">Vendor</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    type="submit"
                    disabled={
                      !confirmPassword ||
                      !password ||
                      !username ||
                      !email ||
                      !firstName ||
                      !lastName ||
                      !phoneNumber ||
                      !address ||
                      !postalCode ||
                      !city ||
                      !province ||
                      !role ||
                      confirmPasswordError
                        ? true
                        : false
                    }
                  >
                    Sign Up
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleAuth0Register}
                  >
                    Register with Auth0
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Box>
        </DialogContent>
      </BootstrapDialog>
    </div>
  );
}
