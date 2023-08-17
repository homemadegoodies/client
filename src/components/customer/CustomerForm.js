import React, { useState } from "react";
import { TextField, Button, FormControl, Grid, MenuItem } from "@mui/material";
import { Image } from "cloudinary-react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

export default function CustomerForm({
  customerData,
  onSave,
  handleEditCancel,
}) {
  const [formData, setFormData] = useState({
    id: customerData.id || "",
    firstName: customerData.firstName || "",
    lastName: customerData.lastName || "",
    username: customerData.username || "",
    email: customerData.email || "",
    phoneNumber: customerData.phoneNumber || "",
    address: customerData.address || "",
    city: customerData.city || "Hamilton",
    province: customerData.province || "ON",
    postalCode: customerData.postalCode || "",
  });
  const [profilePicture, setProfilePicture] = useState(
    customerData.profilePicture || null
  );

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

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "zq5ndrel");
    fetch("https://api.cloudinary.com/v1_1/dkw4fjxeg/image/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        setProfilePicture(data.secure_url);
        setFormData((prevData) => ({
          ...prevData,
          profilePicture: data.secure_url,
        }));
      })
      .catch((error) => {
        console.error(error);
      });
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
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12}>
          {profilePicture ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "1rem",
                border: "1px solid #ccc",
                borderRadius: "4px",
                padding: "1rem",
                cursor: "pointer",
              }}
              onClick={() => {
                window.open(profilePicture, "_blank");
              }}
            >
              <Image
                cloudName="dkw4fjxeg"
                publicId={profilePicture}
                width="200"
                crop="scale"
              />
            </div>
          ) : null}

          <input
            type="file"
            id="file-input"
            style={{ display: "none" }}
            onChange={handleImageUpload}
          />
          <label htmlFor="file-input">
            <Button
              variant="contained"
              component="span"
              color="primary"
              startIcon={<CloudUploadIcon />}
              fullWidth
            >
              {profilePicture
                ? "Change Profile Picture"
                : "Upload Profile Picture"}
            </Button>
          </label>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Phone Number"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Postal Code"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            fullWidth
            required
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
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={
              !formData.firstName ||
              !formData.lastName ||
              !formData.username ||
              !formData.email ||
              !profilePicture ||
              !formData.phoneNumber ||
              !formData.address ||
              !formData.postalCode ||
              !formData.city ||
              !formData.province
            }
          >
            Update
          </Button>
        </Grid>
      </Grid>
    </FormControl>
  );
}
