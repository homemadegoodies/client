import React, { useState, useEffect } from "react";
import { createAPIEndpoint, ENDPOINTS } from "../../api";
import ProductCard from "./ProductCard";
import { Grid, Grow, Slide, TextField, MenuItem } from "@mui/material";

const ProductList = ({ kitchenId }) => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");
  const [selectedCalories, setSelectedCalories] = useState("");

  useEffect(() => {
    createAPIEndpoint(ENDPOINTS.products)
      .fetchByKitchenId(kitchenId.toString())
      .then((res) => setProducts(res.data))
      .catch((err) => console.log(err));
  }, [kitchenId]);

  const priceRanges = [
    { value: "5-10", label: "$5 - $10" },
    { value: "10-20", label: "$10 - $20" },
    { value: "over 20", label: "Over $20" },
  ];

  const calorieRanges = [
    { value: "under 500", label: "Under 500" },
    { value: "500-1000", label: "500 - 1000" },
    { value: "over 1000", label: "Over 1000" },
  ];

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedPrice === "" ||
        (selectedPrice === "5-10" &&
          product.price >= 5 &&
          product.price <= 10) ||
        (selectedPrice === "10-20" &&
          product.price >= 10 &&
          product.price <= 20) ||
        (selectedPrice === "over 20" && product.price > 20)) &&
      (selectedCalories === "" ||
        (selectedCalories === "under 500" && product.calories < 500) ||
        (selectedCalories === "500-1000" &&
          product.calories >= 500 &&
          product.calories <= 1000) ||
        (selectedCalories === "over 1000" && product.calories > 1000))
  );

  const handlePriceChange = (event) => {
    setSelectedPrice(event.target.value);
  };

  return (
    <Slide in={true} direction="down" mountOnEnter unmountOnExit>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ width: "90%" }}>
          <TextField
            label="Search products"
            variant="outlined"
            fullWidth
            margin="normal"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Price"
                value={selectedPrice}
                onChange={handlePriceChange}
                variant="outlined"
                fullWidth
                margin="normal"
              >
                <MenuItem value="">All</MenuItem>
                {priceRanges.map((range) => (
                  <MenuItem key={range.value} value={range.value}>
                    {range.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Calories"
                value={selectedCalories}
                onChange={(e) => setSelectedCalories(e.target.value)}
                variant="outlined"
                fullWidth
                margin="normal"
              >
                <MenuItem value="">All</MenuItem>
                {calorieRanges.map((range) => (
                  <MenuItem key={range.value} value={range.value}>
                    {range.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
          <br />

          <Grid container spacing={3}>
            {filteredProducts.map((product) => (
              <Grid item key={product.id} xs={12} sm={6} md={4}>
                <Grow in={true} timeout={500}>
                  <div>
                    <ProductCard kitchenId={kitchenId} productId={product.id} />
                  </div>
                </Grow>
              </Grid>
            ))}
          </Grid>
        </div>
      </div>
    </Slide>
  );
};

export default ProductList;
