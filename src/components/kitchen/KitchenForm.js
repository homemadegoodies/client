import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useStateContext from "../../hooks/useStateContext";
import { createAPIEndpoint, ENDPOINTS } from "../../api";

import {
  Alert,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Typography,
  Box,
  Slide,
} from "@mui/material";
import { Image } from "cloudinary-react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const KitchenForm = ({ isEditMode }) => {
  const { kitchenId: paramKitchenId } = useParams();
  const [kitchenId, setKitchenId] = useState(
    isEditMode ? paramKitchenId : null
  );
  const { context } = useStateContext();
  const [kitchen, setKitchen] = useState({
    vendorId: context.id,
    name: "",
    description: "",
    imageURL: "",
    platform: "",
    category: "",
    city: "",
  });
  const [isSaved, setIsSaved] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [imageLoading, setImageLoading] = useState(false);

  useEffect(() => {
    const fetchKitchen = async () => {
      try {
        const response = await createAPIEndpoint(ENDPOINTS.kitchens).fetchById(
          kitchenId
        );
        const fetchedKitchen = response.data;

        // Check if the kitchen belongs to the logged in vendor
        const isValidCategory =
          fetchedKitchen.category &&
          [
            "Italian",
            "French",
            "Spanish",
            "Greek",
            "Middle Eastern",
            "Chinese",
            "Indian",
            "Japanese",
            "Korean",
            "Thai",
            "Vietnamese",
            "Mexican",
            "Caribbean",
            "American",
            "Canadian",
            "Vegetarian",
            "Vegan",
            "Gluten Free",
            "Halal",
            "Kosher",
            "Dessert",
            "Other",
          ].includes(fetchedKitchen.category);

        const isValidCity =
          fetchedKitchen.city &&
          [
            "Hamilton",
            "Mississauga",
            "Toronto",
            "Calgary",
            "Vancouver",
          ].includes(fetchedKitchen.city);

        const isValidPrices =
          fetchedKitchen.prices &&
          ["$", "$$", "$$$"].includes(fetchedKitchen.prices);

        setKitchen({
          ...fetchedKitchen,
          category: isValidCategory ? fetchedKitchen.category : "",
          city: isValidCity ? fetchedKitchen.city : "",
          prices: isValidPrices ? fetchedKitchen.prices : "",
        });

        // Fetch products
        const productsResponse = await createAPIEndpoint(
          ENDPOINTS.products
        ).fetchByKitchenId(kitchenId);
        setProducts(productsResponse.data);

        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    if (isEditMode && kitchenId) {
      fetchKitchen();
    } else {
      setLoading(false);
    }
  }, [isEditMode, kitchenId]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setKitchen((prevKitchen) => ({
      ...prevKitchen,
      [name]: value,
    }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "zq5ndrel");
    setImageLoading(true);

    // Make a POST request to Cloudinary API for image upload
    fetch("https://api.cloudinary.com/v1_1/dkw4fjxeg/image/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        setKitchen((prevKitchen) => ({
          ...prevKitchen,
          imageURL: data.secure_url,
        }));
      })
      .catch((error) => {
        console.error("Error uploading image to Cloudinary:", error);
      })
      .finally(() => {
        setImageLoading(false);
      });
  };

  const handleSubmit = () => {
    if (isEditMode) {
      updateKitchen();
    } else {
      saveKitchen();
    }
  };

  const saveKitchen = () => {
    createAPIEndpoint(ENDPOINTS.kitchens)
      .post(kitchen)
      .then((res) => {
        setIsSaved(true);
        setKitchenId(res.data.id);
      })
      .catch((error) => {
        setError(error);
      });
  };

  const updateKitchen = () => {
    createAPIEndpoint(ENDPOINTS.kitchens)
      .put(kitchenId, kitchen)
      .then(() => {
        setIsUpdated(true);
      })
      .catch((error) => {
        setError(error);
      });
  };

  if (loading) {
    return (
      <Card
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "300px",
          width: "100%",
          opacity: 0.5,
          transition: "opacity 0.5s ease-out",
          backgroundColor: "transparent",
          boxShadow: "none",
        }}
      >
        <CircularProgress />
      </Card>
    );
  }

  if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  return (
    <Slide direction="down" in={true} mountOnEnter unmountOnExit>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          {isSaved && (
            <Alert severity="success">Kitchen saved successfully!</Alert>
          )}
          {isUpdated && (
            <Alert severity="success">Kitchen updated successfully!</Alert>
          )}
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Name"
                    name="name"
                    value={kitchen.name}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Description"
                    name="description"
                    value={kitchen.description}
                    onChange={handleChange}
                    multiline
                    rows={4}
                  />
                </Grid>

                <Grid item xs={12}>
                  {kitchen.imageURL ? (
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
                        window.open(kitchen.imageURL, "_blank");
                      }}
                    >
                      <Image
                        cloudName="dkw4fjxeg"
                        publicId={kitchen.imageURL}
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
                      {kitchen.imageURL ? "Change Image" : "Upload Image"}
                    </Button>
                  </label>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select
                      name="category"
                      value={kitchen.category}
                      onChange={handleChange}
                      label="Category"
                      inputProps={{
                        id: "category",
                        name: "category",
                      }}
                    >
                      <MenuItem value="Italian">Italian</MenuItem>
                      <MenuItem value="Greek">Greek</MenuItem>
                      <MenuItem value="Middle Eastern">Middle Eastern</MenuItem>
                      <MenuItem value="Chinese">Chinese</MenuItem>
                      <MenuItem value="Indian">Indian</MenuItem>
                      <MenuItem value="Japanese">Japanese</MenuItem>
                      <MenuItem value="Korean">Korean</MenuItem>
                      <MenuItem value="Thai">Thai</MenuItem>
                      <MenuItem value="Mexican">Mexican</MenuItem>
                      <MenuItem value="Caribbean">Caribbean</MenuItem>
                      <MenuItem value="American">American</MenuItem>
                      <MenuItem value="Canadian">Canadian</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel>City</InputLabel>
                    <Select
                      name="city"
                      value={kitchen.city}
                      onChange={handleChange}
                      label="City"
                    >
                      <MenuItem value="Hamilton">Hamilton</MenuItem>
                      <MenuItem value="Toronto">Toronto</MenuItem>
                      <MenuItem value="Mississauga">Mississauga</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel>Prices</InputLabel>
                    <Select
                      name="prices"
                      value={kitchen.prices || ""}
                      onChange={handleChange}
                      label="Prices"
                    >
                      <MenuItem value="$">$</MenuItem>
                      <MenuItem value="$$">$$</MenuItem>
                      <MenuItem value="$$$">$$$</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleSubmit}
                    disabled={
                      !kitchen.name ||
                      !kitchen.description ||
                      !kitchen.category ||
                      !kitchen.city ||
                      !kitchen.prices ||
                      !kitchen.imageURL ||
                      imageLoading ||
                      (isEditMode && !kitchen.imageURL)
                    }
                  >
                    {isEditMode ? "Update" : "Save"}
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Products
              </Typography>

              {products.length > 0 ? (
                products.map((product) => (
                  <Box key={product.id} mb={2}>
                    <Typography variant="subname1">{product.name}</Typography>
                  </Box>
                ))
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No products found.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Slide>
  );
};

export default KitchenForm;
