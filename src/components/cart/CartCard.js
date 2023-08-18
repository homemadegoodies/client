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
  IconButton,
  Divider,
  Alert,
  OutlinedInput,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogContentText,
  DialogActions,
  LinearProgress,
} from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { makeStyles } from "@mui/styles";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { set } from "date-fns";

const useStyles = makeStyles({
  root: {
    maxWidth: 800,
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

const CartCard = ({ cartId }) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState(null);
  const [order, setOrder] = useState(null);
  const [cartKitchen, setCartKitchen] = useState(null);
  const [cartProducts, setCartProducts] = useState([]);
  const [isInCart, setIsInCart] = useState([]);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [stripeCheckoutOpen, setStripeCheckoutOpen] = useState(false);
  const [orderCreated, setOrderCreated] = useState(false);
  const [cartDeleted, setCartDeleted] = useState(false);
  const { context } = useStateContext();
  const customerId = context.id;
  const isCustomer = context.isCustomer;
  const stripe = useStripe();
  const elements = useElements();

  const fetchCart = async () => {
    try {
      const response = await createAPIEndpoint(ENDPOINTS.carts).fetchCart(
        customerId,
        cartId
      );
      const fetchedCart = response.data;
      const allCartProducts = fetchedCart.cartProducts.map((cartProduct) => ({
        productId: cartProduct.productId,
        quantity: cartProduct.quantity,
        isInCart: true,
      }));
      setIsInCart(allCartProducts);
      setCart(fetchedCart);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchKitchen = async () => {
    try {
      if (cart) {
        const response = await createAPIEndpoint(ENDPOINTS.kitchens).fetchById(
          cart.kitchenId
        );
        const fetchedKitchen = response.data;
        setCartKitchen(fetchedKitchen);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const cartKitchenId = cart ? cart.kitchenId : null;
  const orderVendorId = cartKitchen ? cartKitchen.vendorId : null;

  const fetchProducts = async () => {
    try {
      const response = await createAPIEndpoint(
        ENDPOINTS.products
      ).fetchByKitchenId(cartKitchenId);
      const fetchedProducts = response.data;

      // Update the quantity of each product in cartProducts array
      const updatedCartProducts = cart.cartProducts.map((cartProduct) => {
        const product = fetchedProducts.find(
          (product) => product.id === cartProduct.productId
        );
        if (product) {
          return {
            ...cartProduct,
            name: product.name,
            price: product.price,
            imageURL: product.imageURL,
          };
        }
        return cartProduct;
      });

      setCartProducts(updatedCartProducts);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchCart();
    setLoading(false);
  }, []);

  useEffect(() => {
    if (cart) {
      fetchKitchen();
      fetchProducts();
    }
  }, [cart]);

  const handleIncrementQuantity = (productId) => {
    // Find the product in cartProducts array with the specified productId
    const productToUpdate = cartProducts.find(
      (product) => product.productId === productId
    );

    if (!productToUpdate) {
      return;
    }

    productToUpdate.quantity += 1; // Update the quantity of the product
    updateCart();
  };

  const handleDecrementQuantity = (productId) => {
    // Find the product in cartProducts array with the specified productId
    const productToUpdate = cartProducts.find(
      (product) => product.productId === productId
    );

    if (!productToUpdate) {
      return;
    }

    // Ensure the quantity doesn't go below 1
    productToUpdate.quantity = Math.max(productToUpdate.quantity - 1, 0);

    if (productToUpdate.quantity === 0) {
      // Remove the product from the cart
      const updatedCartProducts = cartProducts.filter(
        (product) => product.productId !== productId
      );

      // If there are no more products in the cart, delete the cart
      if (updatedCartProducts.length === 0) {
        createAPIEndpoint(ENDPOINTS.carts)
          .deleteCart(customerId, cartKitchenId, cart.id)
          .then(() => {
            setCartDeleted(true);
          })
          .catch((err) => console.log(err));
      } else {
        // Update the cart and isInCart array
        updateCart(updatedCartProducts);
      }
    } else {
      // Update the cart and isInCart array
      updateCart(cartProducts);
    }
  };

  const updateCart = () => {
    if (!isCustomer) {
      navigate("/account");
      return;
    }

    const cartToUpdate = {
      customerId: context.id,
      kitchenId: cartKitchenId,
      cartProducts: cartProducts.map(({ productId, quantity }) => ({
        productId,
        quantity,
      })),
    };

    createAPIEndpoint(ENDPOINTS.carts)
      .putCart(customerId, cartKitchenId, cartToUpdate)
      .then((res) => {
        setCartProducts([...cartProducts]); // Trigger a re-render with updated quantity
      })
      .catch((err) => console.log(err));
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

  if (!cart || cartProducts.length === 0) {
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

  const CartTotal = ({ cartProducts }) => {
    // Calculate the total price of all products in the cart
    const calculateTotalPrice = () => {
      return cartProducts.reduce(
        (total, cartProduct) =>
          total + cartProduct.quantity * cartProduct.price,
        0
      );
    };

    const handleConfirmOrder = async () => {
      const newRecord = {
        customerId: customerId,
        vendorId: orderVendorId,
        kitchenId: cartKitchenId,
        cartId: cart.id,
      };
      try {
        setLoading(true);
        createAPIEndpoint(ENDPOINTS.orders)
          .postPaymentIntent({ amount: cart.totalPrice })
          .then((res) => {
            const clientSecret = res.data.clientSecret;
            const paymentIntentId = res.data.paymentIntentId;

            // Confirm the card payment using Stripe
            stripe
              .confirmCardPayment(clientSecret, {
                payment_method: {
                  card: elements.getElement(CardElement),
                },
                paymentIntentId: paymentIntentId,
              })

              .then((result) => {
                if (result.error) {
                  console.error(result.error.message);
                } else {
                  createAPIEndpoint(ENDPOINTS.orders)
                    .postOrder(
                      customerId,
                      orderVendorId,
                      cartKitchenId,
                      cart.id,
                      newRecord
                    )
                    .then((res) => {
                      setOrder(res.data);
                      setOrderCreated(true);
                    })
                    .catch((err) => console.log(err));
                }
              })
              .catch((err) => console.log(err));
          })
          .catch((err) => console.log(err));
      } catch (error) {
        console.error("Error:", error.message);
      } finally {
        setLoading(false);
      }
    };

    const handleMakeOrder = async () => {
      setStripeCheckoutOpen(true);
    };

    const handleStripeCheckoutClose = () => {
      setStripeCheckoutOpen(false);
    };

    const handleDeleteCart = () => {
      setConfirmDialogOpen(true);
    };

    const handleConfirmDelete = () => {
      // Call the API method to delete the cart
      createAPIEndpoint(ENDPOINTS.carts)
        .deleteCart(customerId, cartKitchenId, cart.id)
        .then((res) => {
          setCartDeleted(true);
        })
        .catch((err) => console.log(err));
      setConfirmDialogOpen(false);
    };

    const handleCancelDelete = () => {
      setConfirmDialogOpen(false);
    };

    if (cartDeleted) {
      return (
        <Alert
          severity="success"
          onClose={() => {
            window.location.reload();
          }}
        >
          Cart deleted successfully!
        </Alert>
      );
    }

    if (orderCreated) {
      return (
        <Alert
          severity="success"
          onClose={() => {
            window.location.reload();
          }}
        >
          Order created successfully!
        </Alert>
      );
    }

    return (
      <Box>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ display: "flex", justifyContent: "center" }}
        >
          Cart Total: ${calculateTotalPrice().toFixed(2)}
        </Typography>
        {orderCreated ? (
          <Alert severity="success" sx={{ mt: 2 }}>
            Order created successfully!
          </Alert>
        ) : (
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
              onClick={handleDeleteCart}
            >
              Delete Cart
            </Button>
            {!orderCreated && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleMakeOrder}
                // stick to the right
                sx={{ ml: "auto" }}
                disabled={
                  cartProducts.length === 0 || calculateTotalPrice() === 0
                }
              >
                Make Order
              </Button>
            )}
            <Dialog
              open={stripeCheckoutOpen}
              onClose={handleStripeCheckoutClose}
            >
              <DialogTitle>Make an Order</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Please enter your fake credit card details:
                </DialogContentText>
                <br />
                <CardElement
                  options={{
                    style: {
                      base: {
                        fontSize: "16px",
                        color: "#424770",
                        "::placeholder": {
                          color: "#aab7c4",
                        },
                      },
                      invalid: {
                        color: "#9e2146",
                      },
                    },
                  }}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleStripeCheckoutClose} color="primary">
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmOrder}
                  color="primary"
                  disabled={!stripe}
                >
                  Confirm Order
                </Button>
              </DialogActions>
            </Dialog>

            <Dialog
              open={confirmDialogOpen}
              onClose={handleCancelDelete}
              aria-describedby="alert-dialog-description"
            >
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Are you sure you want to delete this cart?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCancelDelete} color="primary">
                  Cancel
                </Button>
                <Button onClick={handleConfirmDelete} color="error" autoFocus>
                  Delete
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        )}
      </Box>
    );
  };

  return (
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
      <CardHeader title={cartKitchen ? cartKitchen.name : <LinearProgress />} />
      <Divider />
      <CardContent>
        {cartProducts
          .filter((product) => product.quantity > 0) // Filter out products with quantity 0
          .map((product) => (
            <Box
              key={product.productId}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Avatar sx={{ width: 80, height: 80 }}>
                  {" "}
                  {/* Increase the size of the avatar */}
                  <CardMedia
                    component="img"
                    image={product.imageURL}
                    alt={product.name}
                    sx={{ width: "100%", height: "100%", objectFit: "contain" }}
                  />
                </Avatar>
                <Box sx={{ ml: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {product.name}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    Price: ${product.price}
                  </Typography>
                </Box>
              </Box>
              {isCustomer && (
                <CardActions
                  className={classes.actions}
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <IconButton
                    color="primary"
                    aria-label="decrease quantity"
                    onClick={() => handleDecrementQuantity(product.productId)}
                  >
                    <RemoveIcon />
                  </IconButton>
                  <OutlinedInput
                    value={product.quantity}
                    inputProps={{ "aria-label": "quantity", readOnly: true }}
                    sx={{ width: 50, textAlign: "center" }}
                  />
                  <IconButton
                    color="primary"
                    aria-label="increase quantity"
                    onClick={() => handleIncrementQuantity(product.productId)}
                  >
                    <AddIcon />
                  </IconButton>
                </CardActions>
              )}
            </Box>
          ))}
      </CardContent>
      <Divider />

      <CardContent>
        <CartTotal cartProducts={cartProducts} />
      </CardContent>
    </Card>
  );
};

export default CartCard;
