import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { createAPIEndpoint, ENDPOINTS } from "../../api";
import CustomerOrderCard from "./CustomerOrderCard";
import {
  Card,
  CircularProgress,
  Slide,
  Grow,
  Grid,
  TextField,
  MenuItem,
} from "@mui/material";

const CustomerOrders = () => {
  const [loading, setLoading] = useState(false);
  const [customerOrders, setCustomerOrders] = useState([]);
  const [orderKitchens, setOrderKitchens] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedTotalPrice, setSelectedTotalPrice] = useState("");
  const { customerId } = useParams();

  useEffect(() => {
    createAPIEndpoint(ENDPOINTS.orders)
      .fetchByCustomerId(customerId)
      .then((res) => setCustomerOrders(res.data))
      .catch((err) => console.log(err));
  }, [customerId]);

  useEffect(() => {
    createAPIEndpoint(ENDPOINTS.kitchens)
      .fetchAll()
      .then((res) => setOrderKitchens(res.data))
      .catch((err) => console.log(err));
  }, []);

  const orderStatuses = [
    { value: "", label: "All" },
    { value: "Pending", label: "Pending" },
    { value: "In Progress", label: "In Progress" },
    { value: "Ready", label: "Ready" },
  ];

  const totalPriceOptions = [
    { value: "", label: "All" },
    { value: "low_to_high", label: "Low to High" },
    { value: "high_to_low", label: "High to Low" },
  ];

  const filteredOrders = customerOrders.filter((order) => {
    const kitchen = orderKitchens.find((k) => k.id === order.kitchenId) ?? {};

    const kitchenName = kitchen.name ? kitchen.name.toLowerCase() : "";

    return (
      kitchenName.includes(searchQuery.toLowerCase()) &&
      (selectedStatus === "" || order.status === selectedStatus)
    );
  });

  // Sorting the orders based on total price
  if (selectedTotalPrice === "low_to_high") {
    filteredOrders.sort((a, b) => a.totalPrice - b.totalPrice);
  } else if (selectedTotalPrice === "high_to_low") {
    filteredOrders.sort((a, b) => b.totalPrice - a.totalPrice);
  }

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  const handleTotalPriceChange = (event) => {
    setSelectedTotalPrice(event.target.value);
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
    <Slide in={true} direction="right" mountOnEnter unmountOnExit>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ width: "90%" }}>
          <TextField
            label="Search orders"
            variant="outlined"
            fullWidth
            margin="normal"
            value={searchQuery}
            onChange={handleSearch}
          />
          <br />

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Status"
                value={selectedStatus}
                onChange={handleStatusChange}
                variant="outlined"
                fullWidth
                margin="normal"
              >
                {orderStatuses.map((status) => (
                  <MenuItem key={status.value} value={status.value}>
                    {status.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Sort By Total Price"
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
            {filteredOrders.map((order) => (
              <Grid item key={order.id} xs={12} sm={6} md={4}>
                <Grow in={true} timeout={500}>
                  <div>
                    {/* Use your CustomerOrderCard component here passing order details */}
                    <CustomerOrderCard
                      customerId={customerId}
                      orderId={order.id}
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

export default CustomerOrders;
