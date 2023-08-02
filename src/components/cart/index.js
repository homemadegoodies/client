import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { createAPIEndpoint, ENDPOINTS } from "../../api";
import CartCard from "./CartCard";
import {
  Card,
  CircularProgress,
  Slide,
  Grow,
  Grid,
  TextField,
  MenuItem,
} from "@mui/material";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_test_51NVE92IafsfL0hXWGhKEypQr8KlpU5o5ssFHvrrrizmjSLYhPxX8lodNpTVLQtpQj2ikwbcuSA6tkjTIfn1aAtmj009BOYWKqM"
);

const CartList = () => {
  const [loading, setLoading] = useState(false);
  const [customerCarts, setCustomerCarts] = useState([]);
  const [cartKitchens, setCartKitchens] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTotalPrice, setSelectedTotalPrice] = useState("");
  const { customerId } = useParams();

  useEffect(() => {
    createAPIEndpoint(ENDPOINTS.carts)
      .fetchByCustomerId(customerId)
      .then((res) => setCustomerCarts(res.data))
      .catch((err) => console.log(err));
  }, [customerId]);

  useEffect(() => {
    createAPIEndpoint(ENDPOINTS.kitchens)
      .fetchAll()
      .then((res) => setCartKitchens(res.data))
      .catch((err) => console.log(err));
  }, []);

  const totalPriceOptions = [
    { value: "", label: "All" },
    { value: "low_to_high", label: "Low to High" },
    { value: "high_to_low", label: "High to Low" },
  ];

  const filteredCarts = customerCarts.filter((cart) => {
    const kitchen = cartKitchens.find((k) => k.id === cart.kitchenId) ?? {};

    const kitchenName = kitchen.name ? kitchen.name.toLowerCase() : "";

    return kitchenName.includes(searchQuery.toLowerCase());
  });

  if (selectedTotalPrice === "low_to_high") {
    filteredCarts.sort((a, b) => a.totalPrice - b.totalPrice);
  } else if (selectedTotalPrice === "high_to_low") {
    filteredCarts.sort((a, b) => b.totalPrice - a.totalPrice);
  }

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
    <Elements stripe={stripePromise}>
      <Slide in={true} direction="left" mountOnEnter unmountOnExit>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div style={{ width: "90%" }}>
            <TextField
              label="Search carts"
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
              {filteredCarts.map((cart) => (
                <Grid key={cart.id} item xs={12} sm={6} md={4}>
                  <Grow in={true} timeout={1000}>
                    <div>
                      <CartCard cartId={cart.id} />
                    </div>
                  </Grow>
                </Grid>
              ))}
            </Grid>
          </div>
        </div>
      </Slide>
    </Elements>
  );
};

export default CartList;
