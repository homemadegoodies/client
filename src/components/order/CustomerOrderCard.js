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
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
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
      cursor: "pointer",
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

const CustomerOrder = ({ orderId }) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const [orderKitchen, setOrderKitchen] = useState(null);
  const [orderProducts, setOrderProducts] = useState([]);
  const [isInOrder, setIsInOrder] = useState([]);
  const [orderCreated, setOrderCreated] = useState(false);
  const [orderCancelled, setOrderCancelled] = useState(false);
  const [cart, setCart] = useState(null);
  const [isInCart, setIsInCart] = useState([]);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const { context } = useStateContext();
  const customerId = context.id;
  const isCustomer = context.isCustomer;

  const fetchOrder = async () => {
    try {
      const response = await createAPIEndpoint(
        ENDPOINTS.orders
      ).fetchCustomerOrder(customerId, orderId);
      const fetchedOrder = response.data;
      const allOrderProducts = fetchedOrder.orderProducts;

      setIsInOrder(allOrderProducts);
      setOrder(fetchedOrder);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchCarts = async () => {
    try {
      const response = await createAPIEndpoint(
        ENDPOINTS.carts
      ).fetchByCustomerId(customerId);
      const fetchedCarts = response.data;
      if (fetchedCarts && fetchedCarts.length > 0) {
        const allCartProducts = fetchedCarts.reduce(
          (accumulatedProducts, cart) => [
            ...accumulatedProducts,
            ...cart.cartProducts,
          ],
          []
        );
        setIsInCart(allCartProducts);
        setCart(fetchedCarts[0]);
      } else {
        setIsInCart([]);
        setCart(null);
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
  const orderVendorId = orderKitchen ? orderKitchen.vendorId : null;

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
      fetchCarts();
      fetchKitchen();
      fetchProducts();
    }
  }, [order]);

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
    // Calculate the total price of all products in the order
    const calculateTotalPrice = () => {
      return orderProducts.reduce(
        (total, orderProduct) =>
          total + orderProduct.quantity * orderProduct.price,
        0
      );
    };

    const handleMakeOrder = () => {
      const newRecord = {
        customerId: customerId,
        vendorId: orderVendorId,
        kitchenId: orderKitchenId,
        cartId: cart.id,
      };

      createAPIEndpoint(ENDPOINTS.orders)
        .postOrder(
          customerId,
          orderVendorId,
          orderKitchenId,
          cart.id,
          newRecord
        )
        .then((res) => {
          setOrder(res.data);
          setOrderCreated(true);
        })
        .catch((err) => console.log(err));
    };

    const handleDeleteOrder = () => {
      setConfirmDialogOpen(true);
    };

    const handleConfirmDelete = () => {
      createAPIEndpoint(ENDPOINTS.orders)
        .deleteOrder(orderKitchenId, order.id)
        .then((res) => {
          setOrderCancelled(true);
        })
        .catch((err) => console.log(err));
      setConfirmDialogOpen(false);
    };

    const handleCancelDelete = () => {
      setConfirmDialogOpen(false);
    };

    if (orderCancelled) {
      return (
        <Alert
          severity="error"
          onClose={() => {
            window.location.reload();
          }}
        >
          Order cancelled successfully!
        </Alert>
      );
    }

    if (orderCreated) {
      return (
        <div>
          <Alert
            severity="success"
            onClose={() => {
              window.location.reload();
            }}
          >
            Order created successfully!
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
            variant="h6"
            gutterBottom
            sx={{ display: "flex", justifyContent: "center" }}
          >
            Order Status: {order.status}
          </Typography>
          <br />
          <Button
            variant="contained"
            color="error"
            disabled={order.status !== "Pending"}
            onClick={handleDeleteOrder}
            fullWidth
          >
            Cancel Order
          </Button>
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
          variant="p"
          gutterBottom
          sx={{ display: "flex", justifyContent: "center" }}
        >
          Order Status: {order.status}
        </Typography>

        <Typography
          variant="p"
          gutterBottom
          sx={{ display: "flex", justifyContent: "center" }}
        >
          Delivery Date:{" "}
          {order.deliveryDate
            ? format(new Date(order.deliveryDate), "MMMM dd, yyyy HH:mm")
            : "Pending"}
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mt: 2,
          }}
        >
          <Button
            variant="contained"
            color="error"
            disabled={order.status !== "Pending"}
            onClick={handleDeleteOrder}
          >
            Cancel Order
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleMakeOrder}
            sx={{ marginLeft: "auto" }}
            disabled={
              order.status === "Pending" || order.status === "In Progress"
            }
          >
            Reorder
          </Button>
          <Dialog
            open={confirmDialogOpen}
            onClose={handleCancelDelete}
            aria-describedby="alert-dialog-description"
          >
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure you want to cancel this order?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCancelDelete} color="primary">
                No
              </Button>
              <Button onClick={handleConfirmDelete} color="error" autoFocus>
                Yes
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    );
  };

  return (
    <Card
      sx={{
        opacity: loading ? 0.5 : 1,
        transition: "opacity 1s",
        maxWidth: 400,
        margin: "auto",
        marginTop: 2,
      }}
    >
      <CardHeader
        title={orderKitchen ? orderKitchen.name : <CircularProgress />}
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
            {isCustomer && (
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
  );
};

export default CustomerOrder;
