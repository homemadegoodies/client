import React from "react";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import useStateContext from "../../hooks/useStateContext";
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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

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

export default function Login() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { context, setContext } = useStateContext();
  const [error, setError] = useState(
    "Invalid username, password or role. Please try again."
  );
  const [errors, setErrors] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [role, setRole] = useState("customer");
  const [values, setValues] = useState({
    username: "",
    password: "",
  });
  const validate = () => {
    let temp = {};
    temp.username = values.username ? "" : "This field is required.";
    temp.password = values.password ? "" : "This field is required.";
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
      if (role === "customer") {
        createAPIEndpoint(ENDPOINTS.loginCustomer)
          .post(values)
          .then((res) => {
            setContext(res.data);
            if (res.data.statusCode === 1) {
              navigate("/customer/home");
            } else {
              setShowAlert(true);
            }
          })
          .catch((err) => console.log(err));
      } else {
        createAPIEndpoint(ENDPOINTS.loginVendor)
          .post(values)
          .then((res) => {
            setContext(res.data);
            if (res.data.statusCode === 1) {
              navigate("/vendor/home");
            } else {
              setShowAlert(true);
            }
          })
          .catch((err) => console.log(err));
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
    validate({ [name]: value });
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

  return (
    <div>
      <Button variant="contained" onClick={handleClickOpen}>
        Login
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
          Login
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ width: 400, textAlign: "center" }}>
            <Grid item xs={12}>
              {showAlert && (
                <Alert severity="error" onClose={handleCloseAlert}>
                  {error}
                </Alert>
              )}
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                margin="normal"
                variant="outlined"
                label="Username"
                name="username"
                value={values.username}
                helperText="Please enter your username"
                onChange={handleInputChange}
                {...(errors.username && {
                  error: true,
                  helperText: errors.username,
                })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                margin="normal"
                variant="outlined"
                label="Password"
                name="password"
                type="password"
                value={values.password}
                onChange={handleInputChange}
                helperText="Please enter your password"
                {...(errors.password && {
                  error: true,
                  helperText: errors.password,
                })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                label="Role"
                value={role}
                onChange={handleRoleChange}
                fullWidth
                margin="normal"
                variant="outlined"
                helperText="Please select your role"
              >
                <MenuItem value="customer">Customer</MenuItem>
                <MenuItem value="vendor">Vendor</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                onClick={handleSubmit}
                size="large"
                disabled={values.username === "" || values.password === ""}
              >
                Login
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </BootstrapDialog>
    </div>
  );
}
