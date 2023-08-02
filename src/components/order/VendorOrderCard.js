import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { createAPIEndpoint, ENDPOINTS } from "../../api";
import useStateContext from "../../hooks/useStateContext";
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  CircularProgress,
  Box,
  Typography,
  Avatar,
  Button,
  Divider,
  Alert,
  OutlinedInput,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  TextField,
} from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { makeStyles } from "@mui/styles";
import { format } from "date-fns";

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
    transition: "transform 0.2s",
    "&:hover": {
      boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.2)",
      transform: "scale(1.02)",
      transition: "transform 0.3s ease-in-out",
      // cursor: "pointer",
    },
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9 aspect ratio
    position: "relative",
  },
  actions: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "-1rem",
  },
  fadeOut: {
    opacity: 0.5,
    transition: "opacity 0.5s ease-out",
    pointerEvents: "none",
  },
});

const VendorOrder = ({ kitchenId, orderId }) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { context } = useStateContext();
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const [orderCustomer, setOrderCustomer] = useState(null);
  const [orderKitchen, setOrderKitchen] = useState(null);
  const [orderProducts, setOrderProducts] = useState([]);
  const [orderUpdated, setOrderUpdated] = useState(false);
  const [orderCancelled, setOrderCancelled] = useState(false);
  const [acceptDialogOpen, setAcceptDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [status, setStatus] = useState("Pending");
  const [deliveryDate, setDeliveryDate] = useState(new Date());
  const [acceptButtonClicked, setAcceptButtonClicked] = useState(false);
  const vendorId = context.id;
  const isVendor = context.isVendor;

  const fetchOrder = async () => {
    try {
      const response = await createAPIEndpoint(
        ENDPOINTS.orders
      ).fetchVendorOrder(kitchenId, orderId);
      const fetchedOrder = response.data;
      setOrder(fetchedOrder);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchCustomer = async () => {
    try {
      if (order) {
        const response = await createAPIEndpoint(ENDPOINTS.customers).fetchById(
          order.customerId
        );
        const fetchedCustomer = response.data;
        setOrderCustomer(fetchedCustomer);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const fetchKitchen = async () => {
    try {
      if (order) {
        const response = await createAPIEndpoint(ENDPOINTS.kitchens).fetchById(
          order.kitchenId
        );
        const fetchedKitchen = response.data;
        setOrderKitchen(fetchedKitchen);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const orderKitchenId = order ? order.kitchenId : null;

  const fetchProducts = async () => {
    try {
      const response = await createAPIEndpoint(
        ENDPOINTS.products
      ).fetchByKitchenId(orderKitchenId);
      const fetchedProducts = response.data;

      // Update the quantity of each product in orderProducts array
      const updatedOrderProducts = order.orderProducts.map((orderProduct) => {
        const product = fetchedProducts.find(
          (product) => product.id === orderProduct.productId
        );
        if (product) {
          return {
            ...orderProduct,
            name: product.name,
            price: product.price,
            imageURL: product.imageURL,
          };
        }
        return orderProduct;
      });

      setOrderProducts(updatedOrderProducts);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchOrder();
    setLoading(false);
  }, []);

  useEffect(() => {
    if (order) {
      fetchCustomer();
      fetchKitchen();
      fetchProducts();
    }
  }, [order]);

  const handleUpdateOrder = () => {
    if (!isVendor) {
      navigate("/account");
      return;
    }

    const updatedDeliveryDate =
      deliveryDate && deliveryDate instanceof Date ? deliveryDate : new Date();

    const formattedDeliveryDate = updatedDeliveryDate.toISOString();

    const orderToUpdate = {
      vendorId: context.id,
      status: status,
      deliveryDate: formattedDeliveryDate,
      orderProducts: orderProducts.map(({ productId, quantity }) => ({
        productId,
        quantity,
      })),
    };

    createAPIEndpoint(ENDPOINTS.orders)
      .putOrder(vendorId, order.id, orderToUpdate)
      .then((res) => {
        setOrderProducts([...orderProducts]);
        setOrder({
          ...order,
          status: status,
          deliveryDate: updatedDeliveryDate,
        });
        setOrderUpdated(true);
        setAcceptDialogOpen(false);
        setAcceptButtonClicked(true);
      })
      .catch((err) => console.log(err));
  };

  const handleAcceptOrder = () => {
    setAcceptDialogOpen(true);
  };

  const handleCancelAccept = () => {
    setAcceptDialogOpen(false);
  };

  const handleCloseAlert = () => {
    navigate("/kitchens");
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!order || orderProducts.length === 0) {
    return (
      <Alert severity="error" sx={{ marginTop: 2 }} onClose={handleCloseAlert}>
        No orders yet!
      </Alert>
    );
  }

  const OrderTotal = ({ orderProducts }) => {
    const formattedDeliveryDate = order.deliveryDate
      ? format(deliveryDate, "MMMM dd, yyyy HH:mm")
      : "Pending";

    const calculateTotalPrice = () => {
      return orderProducts.reduce(
        (total, orderProduct) =>
          total + orderProduct.quantity * orderProduct.price,
        0
      );
    };

    const handleRejectOrder = () => {
      setRejectDialogOpen(true);
    };

    const handleConfirmReject = () => {
      createAPIEndpoint(ENDPOINTS.orders)
        .deleteOrder(orderKitchenId, order.id)
        .then((res) => {
          setOrderCancelled(true);
        })
        .catch((err) => console.log(err));
      setRejectDialogOpen(false);
    };

    const handleCancelReject = () => {
      setRejectDialogOpen(false);
    };

    if (orderCancelled) {
      return (
        <Alert
          severity="error"
          onClose={() => {
            window.location.reload();
          }}
        >
          Order rejected successfully!
        </Alert>
      );
    }

    if (orderUpdated) {
      return (
        <div>
          <Alert
            severity="success"
            onClose={() => {
              window.location.reload();
            }}
          >
            Order updated successfully!
          </Alert>
          <br />
          <Typography
            variant="h6"
            gutterBottom
            sx={{ display: "flex", justifyContent: "center" }}
          >
            Order Total: ${calculateTotalPrice().toFixed(2)}
          </Typography>
          <Typography
            variant="p"
            gutterBottom
            sx={{ display: "flex", justifyContent: "center" }}
          >
            Order Status: {order.status}
          </Typography>
          {deliveryDate && (
            <Typography
              variant="p"
              gutterBottom
              sx={{ display: "flex", justifyContent: "center" }}
            >
              Delivery Date: {formattedDeliveryDate}
            </Typography>
          )}
        </div>
      );
    }

    return (
      <Box>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ display: "flex", justifyContent: "center" }}
        >
          Order Total: ${calculateTotalPrice().toFixed(2)}
        </Typography>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ display: "flex", justifyContent: "center" }}
        >
          Order Status: {order.status}
        </Typography>
        {deliveryDate && (
          <Typography
            gutterBottom
            sx={{ display: "flex", justifyContent: "center" }}
          >
            Delivery Date: {formattedDeliveryDate}
          </Typography>
        )}

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mt: 2,
          }}
        >
          {order.status === "Pending" && !orderUpdated && (
            <Button
              variant="contained"
              color="error"
              onClick={handleRejectOrder}
            >
              Reject Order
            </Button>
          )}

          {order.status === "Pending" && !orderUpdated && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleAcceptOrder}
            >
              Accept Order
            </Button>
          )}

          {/* Render the Update Order button after Accept Order is clicked */}
          {acceptButtonClicked && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpdateOrder}
              fullWidth
              sx={{ width: "100%" }} // Set the button to take up full width
            >
              Update Order
            </Button>
          )}
          <Dialog
            open={acceptDialogOpen}
            onClose={() => {}}
            aria-describedby="order-dialog-description"
          >
            <DialogTitle>Update Order</DialogTitle>
            <DialogContent>
              <br />
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  label="Status"
                >
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="Ready">Ready</MenuItem>
                </Select>
              </FormControl>
              <Box mt={2}>
                <DateTimePicker
                  label="Delivery Date"
                  value={deliveryDate}
                  onChange={(date) => setDeliveryDate(date)}
                  textField={(params) => <TextField {...params} />}
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleUpdateOrder} color="primary">
                Update
              </Button>
              <Button onClick={handleCancelAccept} color="secondary">
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog
            open={rejectDialogOpen}
            onClose={handleCancelReject}
            aria-describedby="alert-dialog-description"
          >
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure you want to reject this order?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCancelReject} color="primary">
                No
              </Button>
              <Button onClick={handleConfirmReject} color="error" autoFocus>
                Yes
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Card
        className={classes.root}
        sx={{
          opacity: loading ? 0.5 : 1,
          transition: "opacity 1s",
          maxWidth: 400,
          margin: "auto",
          marginTop: 2,
        }}
      >
        <CardHeader
          title={
            orderCustomer ? (
              orderCustomer.firstName + " " + orderCustomer.lastName
            ) : (
              <CircularProgress />
            )
          }
          subheader={orderKitchen ? orderKitchen.name : <CircularProgress />}
        />
        <Divider />
        <CardContent>
          {orderProducts.map((product) => (
            <Box
              key={product.productId}
              sx={{ display: "flex", alignItems: "center", mb: 2 }}
            >
              <Avatar sx={{ width: 60, height: 60 }}>
                <CardMedia
                  component="img"
                  image={product.imageURL}
                  alt={product.name}
                  sx={{ width: "100%", height: "100%" }}
                />
              </Avatar>
              <Box sx={{ ml: 2 }}>
                <Typography variant="h6" gutterBottom>
                  {product.name}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Price: ${product.price}
                </Typography>
              </Box>
              {isVendor && (
                <CardActions
                  className={classes.actions}
                  sx={{ marginLeft: "auto" }}
                >
                  <OutlinedInput
                    value={product.quantity}
                    inputProps={{ "aria-label": "quantity", readOnly: true }}
                    sx={{ width: 50, textAlign: "center" }}
                  />
                </CardActions>
              )}
            </Box>
          ))}
        </CardContent>

        <Divider />
        <CardContent>
          <OrderTotal orderProducts={orderProducts} />
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
};

export default VendorOrder;
