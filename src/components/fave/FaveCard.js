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
  LinearProgress,
  Box,
  Typography,
  Avatar,
  IconButton,
  Divider,
  Alert,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { makeStyles } from "@mui/styles";

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

const FaveCard = ({ faveId, onFaveTotalChange }) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fave, setFave] = useState(null);
  const [isInFaves, setIsInFaves] = useState([]);
  const [faveKitchen, setFaveKitchen] = useState(null);
  const [faveProducts, setFaveProducts] = useState([]);
  const [isInCart, setIsInCart] = useState([]);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [addedToCart, setAddedToCart] = useState(false);
  const [removedFromFaves, setRemovedFromFaves] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [deletedFave, setDeletedFave] = useState(false);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const { context } = useStateContext();
  const customerId = context.id;
  const isCustomer = context.isCustomer;

  const fetchFave = async () => {
    try {
      const response = await createAPIEndpoint(ENDPOINTS.faves).fetchFave(
        customerId,
        faveId
      );
      const fetchedFave = response.data;
      const allFaveProducts = fetchedFave.faveProducts;
      setIsInFaves(allFaveProducts);
      setFave(fetchedFave);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchKitchen = async () => {
    try {
      if (fave) {
        const response = await createAPIEndpoint(ENDPOINTS.kitchens).fetchById(
          fave.kitchenId
        );
        const fetchedKitchen = response.data;
        setFaveKitchen(fetchedKitchen);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const kitchenId = fave ? fave.kitchenId : null;

  const fetchProducts = async () => {
    try {
      const response = await createAPIEndpoint(
        ENDPOINTS.products
      ).fetchByKitchenId(kitchenId);
      const fetchedProducts = response.data;
      const faveProducts = fetchedProducts.filter((product) =>
        isInFaves.some((faveProduct) => faveProduct.productId === product.id)
      );
      setFaveProducts(faveProducts);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchFave();
    setLoading(false);
  }, []);

  useEffect(() => {
    if (fave) {
      fetchKitchen();
      fetchProducts();
    }
  }, [fave]);

  const faveTotal = faveProducts.reduce(
    (acc, product) => acc + product.price,
    0
  );

  useEffect(() => {
    onFaveTotalChange(faveId, faveTotal);
  }, [faveId, faveTotal, onFaveTotalChange]);

  const handleAddToCart = (e, productId) => {
    if (!isCustomer) {
      navigate("/account");
      return;
    }

    // loop through the faveProducts array to find the product with the specified productId
    const productToAdd = faveProducts.find(
      (product) => product.id === productId
    );

    if (!productToAdd) {
      return;
    }

    // Create an array with the single product to be added to cart
    const productsToAdd = [{ productId: productToAdd.id, quantity: 1 }];

    e.stopPropagation();
    createAPIEndpoint(ENDPOINTS.carts)
      .postCart(customerId, kitchenId, {
        customerId: context.id,
        kitchenId: kitchenId,
        cartProducts: productsToAdd,
      })
      .then((res) => {
        setIsInCart((prevProducts) => [...prevProducts, productId]); // Update the state with the new productId
        setAddedToCart(true);
      })
      .catch((err) => console.log(err));
  };

  const handleRemoveFromFaves = (e, productId) => {
    if (!isCustomer) {
      navigate("/account");
      return;
    }
    e.stopPropagation();

    // Find the product in faveProducts array with the specified productId
    const productToRemove = faveProducts.find(
      (product) => product.id === productId
    );

    if (!productToRemove) {
      return;
    }

    // Create an array with the single product to be removed from faveProducts
    const productsToRemove = [{ productId: productToRemove.id }];

    createAPIEndpoint(ENDPOINTS.faves)
      .postFave(customerId, kitchenId, {
        customerId: context.id,
        kitchenId: kitchenId,
        faveProducts: productsToRemove,
      })
      .then((res) => {
        // Update the state to remove the productId from the isInFaves array
        setIsInFaves(
          isInFaves.filter((faveProduct) => faveProduct.productId !== productId)
        );

        // Update the faveProducts state to remove the product from favorites
        setFaveProducts((prevProducts) =>
          prevProducts.filter((product) => product.productId !== productId)
        );

        // refetch faves to update the fave state
        fetchFave();
        setCurrentProduct(productToRemove);
        setRemovedFromFaves(true);
      })
      .catch((err) => console.log(err));
  };

  const handleCloseAlert = () => {
    window.location.reload();
  };

  const handleAllAddToCart = (e) => {
    if (!isCustomer) {
      navigate("/account");
      return;
    }

    e.stopPropagation();
    createAPIEndpoint(ENDPOINTS.carts)
      .postCart(customerId, kitchenId, {
        customerId: customerId,
        kitchenId: kitchenId,
        cartProducts: faveProducts.map((product) => ({
          quantity: selectedQuantity,
          productId: product.id,
        })),
      })
      .then((res) => {
        setIsInCart(faveProducts.map((product) => product.id)); // Update the state with the new productId
        setAddedToCart(true);
      })
      .catch((err) => console.log(err));
  };

  const handleDeleteFave = (e) => {
    setConfirmDialogOpen(true);
  };

  const handleCancelDelete = () => {
    setConfirmDialogOpen(false);
  };

  const handleConfirmDelete = (e) => {
    if (!isCustomer) {
      navigate("/account");
      return;
    }

    e.stopPropagation();
    createAPIEndpoint(ENDPOINTS.faves)
      .deleteFave(customerId, kitchenId, fave.id)
      .then((res) => {
        setIsInFaves([]);
        setFaveProducts([]);
        setDeletedFave(true);
      })
      .catch((err) => console.log(err));

    setConfirmDialogOpen(false);
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
      <CardHeader title={faveKitchen ? faveKitchen.name : <LinearProgress />} />
      <Divider />
      <CardContent>
        {faveProducts.map((product) => (
          <Box
            key={product.id}
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
                <IconButton
                  aria-label="add to cart"
                  color="primary"
                  onClick={(e) => handleAddToCart(e, product.id)}
                >
                  {isInCart.includes(product.id) ? (
                    <ShoppingCartIcon />
                  ) : (
                    <ShoppingCartOutlinedIcon />
                  )}
                </IconButton>
                <IconButton
                  aria-label="add to faves"
                  color="error"
                  onClick={(e) => handleRemoveFromFaves(e, product.id)}
                >
                  <FavoriteIcon />
                </IconButton>
              </CardActions>
            )}
          </Box>
        ))}
      </CardContent>
      <Divider />
      <CardContent>
        {deletedFave && (
          <Alert
            severity="success"
            sx={{ marginTop: 2 }}
            onClose={() => {
              window.location.reload();
            }}
          >
            Fave deleted successfully!
          </Alert>
        )}

        {removedFromFaves && (
          <Alert
            severity="success"
            sx={{ marginTop: 2 }}
            onClose={handleCloseAlert}
          >
            {`${
              currentProduct
                ? `${currentProduct.name} removed from faves`
                : "Product removed from faves"
            }`}
          </Alert>
        )}

        {addedToCart && (
          <Alert
            severity="success"
            sx={{ marginTop: 2 }}
            onClose={handleCloseAlert}
          >
            {`${
              currentProduct
                ? `${currentProduct.name} added to cart`
                : "Product added to cart"
            }`}
          </Alert>
        )}

        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ display: "flex", justifyContent: "center" }}
          >
            Fave Total: $
            {faveProducts.reduce((acc, product) => {
              return acc + product.price;
            }, 0)}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mt: 2,
          }}
        >
          <Button variant="contained" color="error" onClick={handleDeleteFave}>
            Delete Fave
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAllAddToCart}
            sx={{ marginLeft: "auto" }}
          >
            Add All To Cart
          </Button>

          <Dialog
            open={confirmDialogOpen}
            onClose={handleCancelDelete}
            aria-describedby="alert-dialog-description"
          >
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure you want to delete this fave?
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
      </CardContent>
    </Card>
  );
};

export default FaveCard;
