import React, { useState } from "react";
import { TextField, Button, FormControl, Grid, MenuItem } from "@mui/material";

export default function VendorForm({ vendorData, onSave, handleEditCancel }) {
  const [formData, setFormData] = useState({
    id: vendorData.id || "",
    firstName: vendorData.firstName || "",
    lastName: vendorData.lastName || "",
    username: vendorData.username || "",
    email: vendorData.email || "",
    phoneNumber: vendorData.phoneNumber || "",
    address: vendorData.address || "",
    city: vendorData.city || "Hamilton",
    province: vendorData.province || "ON",
    postalCode: vendorData.postalCode || "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleChangeCity = (event) => {
    const city = event.target.value;
    setFormData((prevData) => ({
      ...prevData,
      city: city,
    }));
  };

  const handleChangeProvince = (event) => {
    const province = event.target.value;
    setFormData((prevData) => ({
      ...prevData,
      province: province,
    }));
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  const handleCancel = () => {
    handleEditCancel();
  };

  const cityOptions = ["Hamilton", "Toronto", "Mississauga"];
  const provinceOptions = ["ON", "AB", "BC"];

  return (
    <FormControl>
      <br />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Phone Number"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Postal Code"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            select
            label="City"
            value={formData.city || "Hamilton"}
            fullWidth
            margin="normal"
            onChange={handleChangeCity}
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
            value={formData.province || "ON"}
            fullWidth
            margin="normal"
            onChange={handleChangeProvince}
          >
            {provinceOptions.map((province) => (
              <MenuItem key={province} value={province}>
                {province}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid
          item
          xs={12}
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
          }}
        >
          <Button variant="outlined" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSubmit}>
            Save
          </Button>
        </Grid>
      </Grid>
    </FormControl>
  );
}
