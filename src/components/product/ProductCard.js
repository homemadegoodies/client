import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import useStateContext from "../../hooks/useStateContext";
import { createAPIEndpoint, ENDPOINTS } from "../../api";
import ProductForm from "./ProductForm";
import {
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Typography,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Grid,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
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

const ProductCard = ({ kitchenId, productId }) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { context } = useStateContext();
  const [loading, setLoading] = useState(false);
  const [kitchen, setKitchen] = useState(null);
  const [product, setProduct] = useState(null);
  const [openProduct, setOpenProduct] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [selectedView, setSelectedView] = useState("ingredients");
  const [cartProducts, setCartProducts] = useState([]);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [isInFaves, setIsInFaves] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const isCustomer = context.isCustomer;
  const isVendor = context.isVendor;
  const cutomerId = context.id;

  useEffect(() => {
    // Fetch kitchen data
    createAPIEndpoint(ENDPOINTS.kitchens)
      .fetchById(kitchenId)
      .then((res) => setKitchen(res.data))
      .catch((err) => console.log(err));

    // Fetch product data
    setLoading(true);
    createAPIEndpoint(ENDPOINTS.products)
      .fetchProduct(kitchenId.toString(), productId)
      .then((res) => {
        setProduct(res.data);
        setIsInFaves(res.data.isInFaves || []);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });

    if (isCustomer) {
      // Fetch cart data
      const fetchCarts = async () => {
        try {
          const response = await createAPIEndpoint(ENDPOINTS.carts).fetchByCustomerId(context.id);
          const fetchedCarts = response.data;
          const allCartProducts = fetchedCarts.reduce(
            (accumulatedProducts, cart) => [
              ...accumulatedProducts,
              ...cart.cartProducts.map((cartProduct) => cartProduct.productId),
            ],
            []
          );
          setCartProducts(allCartProducts);
        } catch (err) {
          console.log(err);
        }
      };
      fetchCarts();

      // Fetch faves data
      const fetchFaves = async () => {
        try {
          const response = await createAPIEndpoint(ENDPOINTS.faves).fetchByCustomerId(context.id);
          const fetchedFaves = response.data;
          const allFaveProducts = fetchedFaves.reduce(
            (accumulatedProducts, fave) => [...accumulatedProducts, ...fave.faveProducts],
            []
          );
          setIsInFaves(allFaveProducts);
        } catch (err) {
          console.log(err);
        }
      };
      fetchFaves();
    }
  }, [kitchenId, productId, isCustomer, context.id]);

  const handleProductClick = () => {
    if (isButtonClicked) {
      setIsButtonClicked(true);
    } else {
      setOpenProduct(true);
    }
  };

  const handleProductClose = () => {
    setOpenProduct(false);
  };

  const handleDeleteDialogOpen = (e) => {
    e.stopPropagation();
    setOpenDeleteDialog(true);
  };

  const handleDeleteDialogClose = (e) => {
    setOpenDeleteDialog(false);
  };

  const handleEditDialogOpen = (e) => {
    e.stopPropagation();
    setOpenEditDialog(true);
  };

  const handleEditDialogClose = (e) => {
    setOpenEditDialog(false);
  };

  const handleEditConfirm = (updatedProduct) => {
    setIsEditing(true);
    createAPIEndpoint(ENDPOINTS.products)
      .putProduct(kitchenId, productId, updatedProduct)
      .then((res) => {
        setIsEditing(false);
        setProduct(updatedProduct);
        handleEditDialogClose();
        setIsEditMode(false);
      })
      .catch((err) => console.log(err));
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setOpenEditDialog(false);
    setIsEditMode(true);
    document.removeEventListener("click", handleClickOutside);
  };

  const handleDeleteConfirm = (e) => {
    e.stopPropagation();
    setIsDeleting(true);
    setOpenDeleteDialog(true);
    createAPIEndpoint(ENDPOINTS.products)
      .deleteProduct(kitchenId, productId)
      .then((res) => setIsDeleted(true))
      .catch((err) => console.log(err));
    handleDeleteDialogClose();
  };

  const handleDeleteCancel = () => {
    setIsDeleting(false);
    setOpenDeleteDialog(false);
    document.removeEventListener("click", handleClickOutside);
  };

  const handleClickOutside = (e) => {
    if (e.target.nodeName !== "BUTTON") {
      setIsDeleting(false);
      document.removeEventListener("click", handleClickOutside);
    }
  };

  const handleViewChange = (event, newView) => {
    setSelectedView(newView);
  };

  const handleAddToCart = (e) => {
    if (!isCustomer) {
      navigate("/account");
      return;
    }

    e.stopPropagation();
    createAPIEndpoint(ENDPOINTS.carts)
      .postCart(cutomerId, kitchenId, {
        customerId: cutomerId,
        kitchenId: kitchenId,
        cartProducts: [
          {
            productId: productId,
            quantity: selectedQuantity,
          },
        ],
      })
      .then((res) => {
        setCartProducts(res.data.cartProducts);
      })
      .catch((err) => console.log(err));
  };

  const handleAddToFaves = (e) => {
    if (!isCustomer) {
      navigate("/account");
      return;
    }
    e.stopPropagation();
    createAPIEndpoint(ENDPOINTS.faves)
      .postFave(cutomerId, kitchenId, {
        customerId: context.id,
        kitchenId: kitchenId,
        faveProducts: [{ productId }],
      })
      .then((res) => {
        setIsInFaves(res.data.faveProducts);
      })
      .catch((err) => console.log(err));
  };

  const isProductInFaves = () => {
    return isInFaves.some((faveProduct) => faveProduct.productId === productId);
  };

  const isProductInCart = () => {
    return cartProducts.some((cartProduct) => cartProduct.productId === productId);
  };

  if (!product) {
    return null;
  }

  if (!product && !isDeleted) {
    <Card
      sx={{
        height: "300px",
        width: "100%",
        opacity: 0.5,
        transition: "opacity 0.5s ease-out",
        backgroundColor: "transparent",
        boxShadow: "none",
      }}
    >
      <CircularProgress />
    </Card>;
  }

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

  if (isDeleted) {
    return null;
  }

  const editAndDeleteActions = isVendor &&
    kitchen &&
    cutomerId === kitchen.vendorId && (
      <CardActions className={classes.actions}>
        <IconButton
          aria-label="edit"
          color="primary"
          onClick={handleEditDialogOpen}
        >
          <Edit />
        </IconButton>
        <IconButton
          aria-label="delete"
          color="error"
          onClick={handleDeleteDialogOpen}
        >
          <Delete />
        </IconButton>
      </CardActions>
    );

  const addToCartAndFavesActions = isCustomer && (
    <CardActions className={classes.actions}>
      <IconButton
        aria-label="add to cart"
        color="primary"
        onClick={handleAddToCart}
      >
        { isProductInCart() ?
        (
          <ShoppingCartIcon />
        ) : (
          <ShoppingCartOutlinedIcon />
        )}
      </IconButton>
      <IconButton
        aria-label="add to faves"
        color="error"
        onClick={handleAddToFaves}
      >
        {isProductInFaves() ? <FavoriteIcon /> : <FavoriteBorderIcon />}
      </IconButton>
    </CardActions>
  );

  return (
    <>
      <Card
        className={`${classes.root} ${
          isDeleting || isEditMode ? classes.fadeOut : ""
        }`}
        onClick={handleProductClick}
      >
        <div className={classes.media}>
          <IconButton
            aria-label="play"
            color="primary"
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            {product.imageURL ? (
              <img
                src={product.imageURL}
                alt={product.name}
                style={{ width: "100%" }}
              />
            ) : (
              <RestaurantIcon />
            )}
          </IconButton>
        </div>
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {product.name}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {product.description}
          </Typography>
        </CardContent>
        {editAndDeleteActions}
        {addToCartAndFavesActions}
      </Card>
      <Dialog
        open={openProduct}
        onClose={handleProductClose}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>{product.name}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              {product.imageURL && (
                <img
                  src={product.imageURL}
                  alt={product.name}
                  style={{ width: "300px", borderRadius: "5px" }}
                />
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography>{product.description}</Typography>
              <Typography variant="body1" color="textSecondary">
                ${product.price}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                Calories: {product.calories}
              </Typography>

              {!isVendor && (
                <div>
                  <TextField
                    type="number"
                    label="Quantity"
                    variant="outlined"
                    sx={{
                      width: "200px",
                      marginTop: "1rem",
                    }}
                    value={selectedQuantity}
                    onChange={(e) => setSelectedQuantity(e.target.value)}
                    inputProps={{ min: 1, max: 15 }}
                  />
                  <br />
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{
                      marginTop: "1rem",
                      marginRight: "1rem",
                    }}
                    onClick={handleAddToCart}
                  >
                    Add to Cart
                  </Button>
                  {isProductInFaves() ? (
                    <Button
                      variant="contained"
                      color="error"
                      sx={{
                        marginTop: "1rem",
                      }}
                      onClick={handleAddToFaves}
                    >
                      Remove from Faves
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{
                        marginTop: "1rem",
                      }}
                      onClick={handleAddToFaves}
                    >
                      Add to Faves
                    </Button>
                  )}
                </div>
              )}
            </Grid>
          </Grid>
          <br />

          <ToggleButtonGroup
            sx={{ display: "flex", justifyContent: "center" }}
            value={selectedView}
            exclusive
            onChange={handleViewChange}
            aria-label="view selector"
            fullWidth
          >
            <ToggleButton value="ingredients" aria-label="centered">
              Ingredients
            </ToggleButton>
            <ToggleButton value="recipe" aria-label="right aligned">
              Recipe
            </ToggleButton>
          </ToggleButtonGroup>

          {selectedView === "ingredients" && product.ingredients && (
            <List>
              {product.ingredients.map((ingredient, index) => (
                <ListItem key={index}>
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        backgroundColor: "#f50057",
                        color: "#fff",
                        width: "100px",
                        height: "100px",
                        marginRight: "1rem",
                        fontSize: "1rem",
                      }}
                    >
                      {ingredient.ingredientQuantity}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={ingredient.ingredientName} />
                </ListItem>
              ))}
            </List>
          )}

          {selectedView === "recipe" && product.recipe && (
            <List>
              {product.recipe.map((step, index) => (
                <ListItem key={index}>
                  <ListItemAvatar>
                    <Avatar sx={{ backgroundColor: "#f50057" }}>
                      {index + 1}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={step.step} />
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleProductClose}>Close</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openDeleteDialog} onClose={handleDeleteDialogClose}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this product?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openEditDialog} onClose={handleEditDialogClose}>
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent>
          <ProductForm
            kitchenId={kitchenId}
            productId={productId}
            product={product}
            isEditing={isEditing}
            handleEditCancel={handleEditCancel}
            handleEditConfirm={handleEditConfirm}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductCard;
