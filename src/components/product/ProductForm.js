import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { createAPIEndpoint, ENDPOINTS } from "../../api";
import {
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Grid,
} from "@mui/material";

const ProductForm = ({ productId, handleEditConfirm }) => {
  const { kitchenId } = useParams();
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [hasRecipe, setHasRecipe] = useState(false);
  const [product, setProduct] = useState({
    kitchenId: kitchenId,
    name: "",
    description: "",
    price: 5,
    calories: 500,
    imageURL: "",
    recipe: [],
    ingredients: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  const [alert, setAlert] = useState({
    open: false,
    severity: "",
    message: "",
  });
  const [recipe, setRecipe] = useState({
    stepNumber: 1,
    step: "",
  });
  const [isUpdate, setIsUpdate] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [ingredients, setIngredients] = useState([
    { ingredientQuantity: "", ingredientName: "" },
  ]);

  const loadProduct = () => {
    setLoading(true);
    createAPIEndpoint(ENDPOINTS.products)
      .fetchProduct(kitchenId.toString(), productId)
      .then((res) => {
        setLoading(false);
        setProduct(res.data);
        setIngredients(res.data.ingredients);
        setRecipe(res.data.recipe);
        setShowButtons(true);
      })
      .catch((err) => console.log(err));
  };

  const updateHasRecipe = () => {
    const hasRecipe = product.recipe.some((step) => step.step.trim() !== "");
    setHasRecipe(hasRecipe);
  };

  useEffect(() => {
    updateHasRecipe();
  }, [product]);

  useEffect(() => {
    if (productId) {
      setIsUpdate(true);
      loadProduct();
    } else {
      setIsUpdate(false);
      setLoading(false);
      setShowButtons(true);
    }
  }, [productId]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (
      name.startsWith("ingredientQuantity") ||
      name.startsWith("ingredientName")
    ) {
      // Handle ingredient changes
      const index = parseInt(name.slice(-1));
      setIngredients((prevIngredients) => {
        const updatedIngredients = [...prevIngredients];
        updatedIngredients[index][name.slice(0, -1)] = value;
        return updatedIngredients;
      });
    } else if (name === "recipe") {
      // Handle recipe changes
      const index = parseInt(event.target.getAttribute("data-index"));
      handleRecipeChange(index, value);
    } else {
      // Handle other product changes
      setProduct((prevProduct) => ({
        ...prevProduct,
        [name]: value,
      }));
    }
  };

  const handleAddIngredient = () => {
    setIngredients((prevIngredients) => [
      ...prevIngredients,
      { ingredientQuantity: "", ingredientName: "" },
    ]);
  };

  const handleDeleteIngredient = (index) => {
    setIngredients((prevIngredients) => {
      const updatedIngredients = [...prevIngredients];
      updatedIngredients.splice(index, 1);
      return updatedIngredients;
    });
  };

  const handleOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleRecipeChange = (index, step) => {
    setProduct((prevProduct) => {
      const recipe = [...prevProduct.recipe];
      recipe[index].step = step;
      return { ...prevProduct, recipe };
    });
  };

  const handleAddRecipe = () => {
    setProduct((prevProduct) => {
      const nextRecipeNumber = prevProduct.recipe.length + 1;
      return {
        ...prevProduct,
        recipe: [
          ...prevProduct.recipe,
          { stepNumber: nextRecipeNumber, step: "" },
        ],
      };
    });
  };

  const handleDeleteRecipe = (index) => {
    setProduct((prevProduct) => {
      const recipe = [...prevProduct.recipe];
      recipe.splice(index, 1);
      return { ...prevProduct, recipe };
    });
  };

  const handleSave = () => {
    setLoading(true);
    const updatedProduct = {
      ...product,
      recipe: product.recipe.filter((step) => step.step.trim() !== ""), // Remove empty recipe steps
      ingredients: ingredients.filter(
        (ingredient) =>
          ingredient.ingredientQuantity.trim() !== "" ||
          ingredient.ingredientName.trim() !== ""
      ), // Remove empty ingredients
    };

    if (productId) {
      createAPIEndpoint(ENDPOINTS.products)
        .putProduct(kitchenId, productId, updatedProduct)
        .then((res) => {
          setLoading(false);
          setOpen(false);
          handleEditConfirm(updatedProduct); // Pass the updated product data
        })
        .catch((err) => {
          setAlert({
            open: true,
            severity: "error",
            message: "Failed to update product.",
          });
          setLoading(false);
          console.log(err);
        });
    } else {
      createAPIEndpoint(ENDPOINTS.products)
        .postProduct(kitchenId, updatedProduct)
        .then((res) => {
          setAlert({
            open: true,
            severity: "success",
            message: "Product added successfully.",
          });
          setLoading(false);
          setOpen(false);
          // Update the product state in the parent component
          handleModelUpdate(res.data);
        })
        .catch((err) => {
          setAlert({
            open: true,
            severity: "error",
            message: "Failed to add product.",
          });
          setLoading(false);
          console.log(err);
        });
    }
  };

  const handleModelUpdate = (model) => {
    setProduct(model);
  };

  const controller = {
    handleAddRecipe,
    handleDeleteRecipe,
    handleModelUpdate,
  };

  return (
    <div>
      {alert.open && (
        <Alert
          severity={alert.severity}
          onClose={() => setAlert({ open: false })}
        >
          {alert.message}
        </Alert>
      )}

      <TextField
        variant="outlined"
        label="Name"
        name="name"
        value={product.name}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        variant="outlined"
        label="Description"
        name="description"
        value={product.description}
        onChange={handleChange}
        fullWidth
        multiline
        rows={3}
        margin="normal"
        required
      />
      <TextField
        variant="outlined"
        label="Image URL"
        name="imageURL"
        value={product.imageURL}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            type="number"
            variant="outlined"
            label="Price"
            name="price"
            value={product.price}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            type="number"
            variant="outlined"
            label="Calories"
            name="calories"
            value={product.calories}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
        </Grid>
      </Grid>
      <Button
        style={{ float: "right", marginTop: "1rem", marginLeft: "1rem" }}
        onClick={handleSave}
      >
        {isUpdate ? "Update Product" : "Save Product"}
      </Button>
      {showButtons && (
        <Button
          onClick={handleOpenDialog}
          style={{ float: "right", marginTop: "1rem" }}
        >
          {isUpdate
            ? "Update Ingredients and Recipe"
            : "Add Ingredients and Recipe"}
        </Button>
      )}
      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>Add Ingredients and Recipe</DialogTitle>
        <DialogContent>
          {/* Show the list of ingredients */}
          {ingredients.map((ingredient, index) => (
            <div key={index}>
              <TextField
                label={`Ingredient Quantity ${index + 1}`}
                name={`ingredientQuantity${index}`}
                value={ingredient.ingredientQuantity}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label={`Ingredient Name ${index + 1}`}
                name={`ingredientName${index}`}
                value={ingredient.ingredientName}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
              />
              <Button
                variant="outlined"
                color="error"
                onClick={() => handleDeleteIngredient(index)}
              >
                Remove Ingredient
              </Button>
            </div>
          ))}
          <div style={{ marginTop: "1rem", textAlign: "right" }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleAddIngredient}
            >
              Add Ingredient
            </Button>
          </div>

          {/* Show the list of recipe steps */}
          {product.recipe.map((step, index) => (
            <div key={index}>
              <TextField
                label={`Recipe Step ${index + 1}`}
                name="step"
                value={step.step}
                onChange={(event) =>
                  handleRecipeChange(index, event.target.value)
                }
                fullWidth
                margin="normal"
                required
              />
              <Button
                variant="outlined"
                color="error"
                onClick={() => handleDeleteRecipe(index)}
              >
                Remove Recipe Step
              </Button>
            </div>
          ))}

          {/* Button to add a new recipe step */}
          <div style={{ marginTop: "1rem", textAlign: "right" }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleAddRecipe}
            >
              Add Recipe Step
            </Button>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSave}>
            {isUpdate ? "Update Product" : "Save Product"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ProductForm;
