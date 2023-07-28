import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { createAPIEndpoint, ENDPOINTS } from "../../api";
import VendorOrderCard from "./VendorOrderCard";
import {
  Card,
  CircularProgress,
  Slide,
  Grow,
  Grid,
  TextField,
  MenuItem,
} from "@mui/material";

const VendorOrders = () => {
  const [loading, setLoading] = useState(false);
  const [vendorOrders, setVendorOrders] = useState([]);
  const [kitchens, setKitchens] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedTotalPrice, setSelectedTotalPrice] = useState("");
  const { vendorId } = useParams();

  useEffect(() => {
    createAPIEndpoint(ENDPOINTS.orders)
      .fetchByVendorId(vendorId)
      .then((res) => setVendorOrders(res.data))
      .catch((err) => console.log(err));
  }, [vendorId]);

  useEffect(() => {
    createAPIEndpoint(ENDPOINTS.kitchens)
      .fetchAll()
      .then((res) => setKitchens(res.data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if (vendorOrders.length > 0) {
      setLoading(true);
      vendorOrders.forEach((order, index) => {
        createAPIEndpoint(ENDPOINTS.customers)
          .fetchById(order.customerId)
          .then((res) => {
            vendorOrders[index].customer = res.data;
            if (index === vendorOrders.length - 1) {
              setLoading(false);
            }
          })
          .catch((err) => console.log(err));
      });
    }
  }, [vendorOrders]);

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

  const filteredOrders = vendorOrders.filter((order) => {
    const customer = order.customer || {};
    const kitchen = kitchens.find((k) => k.id === order.kitchenId) ?? {};

    const customerName =
      `${customer.firstName} ${customer.lastName}`.toLowerCase();
    const kitchenName = kitchen.name ? kitchen.name.toLowerCase() : "";

    return (
      (customerName.includes(searchQuery.toLowerCase()) ||
        kitchenName.includes(searchQuery.toLowerCase())) &&
      (selectedStatus === "" || order.status === selectedStatus)
    );
  });

  // Sorting the orders based on total price
  if (selectedTotalPrice === "low_to_high") {
    filteredOrders.sort((a, b) => a.totalPrice - b.totalPrice);
  } else if (selectedTotalPrice === "high_to_low") {
    filteredOrders.sort((a, b) => b.totalPrice - a.totalPrice);
  }

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
            onChange={(e) => setSearchQuery(e.target.value)}
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
                    {/* Use your VendorOrderCard component here passing order details */}
                    <VendorOrderCard vendorId={vendorId} orderId={order.id} />
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

export default VendorOrders;
