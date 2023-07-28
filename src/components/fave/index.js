import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { createAPIEndpoint, ENDPOINTS } from "../../api";
import FaveCard from "./FaveCard";
import {
  Card,
  CircularProgress,
  Slide,
  Grow,
  Grid,
  TextField,
  MenuItem,
} from "@mui/material";

const FaveList = () => {
  const [loading, setLoading] = useState(false);
  const [customerFaves, setCustomerFaves] = useState([]);
  const [faveKitchens, setFaveKitchens] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTotalPrice, setSelectedTotalPrice] = useState("");
  const { customerId } = useParams();

  useEffect(() => {
    createAPIEndpoint(ENDPOINTS.faves)
      .fetchByCustomerId(customerId)
      .then((res) => setCustomerFaves(res.data))
      .catch((err) => console.log(err));
  }, [customerId]);

  useEffect(() => {
    createAPIEndpoint(ENDPOINTS.kitchens)
      .fetchAll()
      .then((res) => setFaveKitchens(res.data))
      .catch((err) => console.log(err));
  }, []);

  const totalPriceOptions = [
    { value: "", label: "All" },
    { value: "low_to_high", label: "Low to High" },
    { value: "high_to_low", label: "High to Low" },
  ];

  const filteredFaves = customerFaves.filter((fave) => {
    const kitchen = faveKitchens.find((k) => k.id === fave.kitchenId) ?? {};

    const kitchenName = kitchen.name ? kitchen.name.toLowerCase() : "";

    return kitchenName.includes(searchQuery.toLowerCase());
  });

  // Sort the filteredFaves based on selectedTotalPrice
  if (selectedTotalPrice === "low_to_high") {
    filteredFaves.sort((a, b) => a.totalPrice - b.totalPrice);
  } else if (selectedTotalPrice === "high_to_low") {
    filteredFaves.sort((a, b) => b.totalPrice - a.totalPrice);
  }

  const handleFaveTotalChange = (faveId, faveTotal) => {
    setCustomerFaves((prevFaves) => {
      const updatedFaves = prevFaves.map((fave) =>
        fave.id === faveId ? { ...fave, totalPrice: faveTotal } : fave
      );
      return updatedFaves;
    });
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleTotalPriceChange = (e) => {
    setSelectedTotalPrice(e.target.value);
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

  return (
    <Slide in={true} direction="down" mountOnEnter unmountOnExit>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ width: "90%" }}>
          <TextField
            label="Search faves"
            variant="outlined"
            value={searchQuery}
            onChange={handleSearch}
            fullWidth
            margin="normal"
          />
          <br />

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                select
                label="Total Price"
                value={selectedTotalPrice}
                onChange={handleTotalPriceChange}
                variant="outlined"
                fullWidth
                margin="normal"
              >
                {totalPriceOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            {filteredFaves.map((fave) => (
              <Grid key={fave.id} item xs={12} sm={6} md={4}>
                <Grow in={true} timeout={1000}>
                  <div>
                    <FaveCard
                      faveId={fave.id}
                      onFaveTotalChange={handleFaveTotalChange}
                    />
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

export default FaveList;
