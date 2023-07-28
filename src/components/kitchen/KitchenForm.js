import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useStateContext from "../../hooks/useStateContext";
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
  CardActions,
  Grid,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
} from "@mui/material";
import { createAPIEndpoint, ENDPOINTS } from "../../api";
import ProductForm from "../product/ProductForm";

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
  const [openProductFormDialog, setOpenProductFormDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);

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
          ["Italian", "Middle Eastern", "Caribbean"].includes(
            fetchedKitchen.category
          );

        const isValidCity =
          fetchedKitchen.city &&
          ["Hamilton", "Mississauga", "Toronto"].includes(fetchedKitchen.city);

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

  const handleCloseProductFormDialog = () => {
    setOpenProductFormDialog(false);
  };

  const handleProductForm = () => {
    setOpenProductFormDialog(true);
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
                <TextField
                  fullWidth
                  label="Image URL"
                  name="imageURL"
                  value={kitchen.imageURL}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="category"
                    value={kitchen.category}
                    onChange={handleChange}
                    label="Category"
                  >
                    <MenuItem value="Italian">Italian</MenuItem>
                    <MenuItem value="Middle Eastern">Middle Eastern</MenuItem>
                    <MenuItem value="Caribbean">Caribbean</MenuItem>
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
                    value={kitchen.prices}
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
                  onClick={handleSubmit}
                  fullWidth
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
  );
};

export default KitchenForm;
