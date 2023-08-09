import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createAPIEndpoint, ENDPOINTS } from "../../api";
import useStateContext from "../../hooks/useStateContext";
import {
  Alert,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  IconButton,
  Typography,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Slide,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ProfileIcon from "@mui/icons-material/AccountCircle";
import { makeStyles } from "@mui/styles";
import ProductList from "../product/index";
import ProductForm from "../product/ProductForm";

const useStyles = makeStyles({
  root: {
    maxWidth: 800,
    margin: "0 auto",
  },
  media: {
    position: "relative",
    height: 300,
    width: "100%",
    objectFit: "cover",
  },
  fadeOut: {
    opacity: 0.5,
    transition: "opacity 0.5s ease-out",
    pointerEvents: "none",
  },
  actionButtons: {
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 1,
  },
});

const ViewKitchen = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { kitchenId } = useParams();
  const [kitchen, setKitchen] = useState(null);
  const [open, setOpen] = useState(false);
  const { context } = useStateContext();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [openAddProductDialog, setOpenAddProductDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchKitchen = async () => {
      try {
        const response = await createAPIEndpoint(ENDPOINTS.kitchens).fetchById(
          kitchenId
        );

        if (response.data) {
          setKitchen(response.data);
        } else {
          setError("Kitchen not found");
        }
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchKitchen();
  }, [kitchenId]);

  const handleDialogOpen = () => {
    setOpen(true);
  };

  const handleDialogClose = () => {
    setOpen(false);
  };

  const handleAddProductDialogOpen = () => {
    setOpenAddProductDialog(true);
  };

  const handleAddProductDialogClose = () => {
    setOpenAddProductDialog(false);
  };

  const handleVendorProfile = () => {
    navigate(`/customer/${context.id}/vendor/${kitchen.vendorId}`);
  };

  const handleEdit = () => {
    navigate(`/vendor/kitchens/edit/${kitchenId}`);
  };

  const handleDeleteConfirm = () => {
    setIsDeleting(true);
    handleDialogOpen();
    document.addEventListener("click", handleClickOutside);
  };

  const handleDeleteCancel = () => {
    setIsDeleting(false);
    handleDialogClose();
    document.removeEventListener("click", handleClickOutside);
  };

  const handleClickOutside = (e) => {
    if (e.target.nodeName !== "BUTTON") {
      setIsDeleting(false);
      document.removeEventListener("click", handleClickOutside);
    }
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

  if (error) {
    return (
      <CardContent>
        <Alert severity="error">
          {error.message ? error.response.data : "Something went wrong"}
        </Alert>
      </CardContent>
    );
  }

  if (isDeleted) {
    return null;
  }

  return (
    <div>
      <Slide in={true} direction="up" mountOnEnter unmountOnExit>
        <Card
          className={`${classes.root} ${isDeleting ? classes.fadeOut : ""}`}
        >
          <CardMedia
            className={classes.media}
            image={kitchen.imageURL}
            title={kitchen.title}
          >
            {context.isVendor && context.id === kitchen.vendorId && (
              <CardActions className={classes.actionButtons}>
                <Tooltip title="Add a Product" aria-label="Add a Product">
                  <IconButton onClick={handleAddProductDialogOpen}>
                    <AddIcon
                      sx={{
                        color: "#f5f5f5",
                      }}
                    />
                  </IconButton>
                </Tooltip>
                <Dialog
                  open={openAddProductDialog}
                  onClose={handleAddProductDialogClose}
                >
                  <DialogTitle>Edit Product</DialogTitle>
                  <DialogContent>
                    <ProductForm kitchenId={kitchenId} />
                  </DialogContent>
                </Dialog>

                <Tooltip title="Edit Kitchen" aria-label="Edit Kitchen">
                  <IconButton onClick={handleEdit}>
                    <EditIcon
                      sx={{
                        color: "#f5f5f5",
                      }}
                    />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete Kitchen" aria-label="Delete Kitchen">
                  <IconButton onClick={handleDeleteConfirm}>
                    <DeleteIcon
                      sx={{
                        color: "error.main",
                      }}
                    />
                  </IconButton>
                </Tooltip>
                <Dialog open={open} onClose={handleDialogClose}>
                  <DialogTitle>Confirmation</DialogTitle>
                  <DialogContent>
                    Are you sure you want to delete this kitchen?
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleDeleteCancel}>Cancel</Button>
                    <Button
                      onClick={() => {
                        handleDialogClose();
                        createAPIEndpoint(ENDPOINTS.kitchens)
                          .delete(kitchenId)
                          .then((res) => setIsDeleted(true))
                          .then((res) => navigate("/vendor/home"))
                          .catch((err) => console.log(err));
                      }}
                      color="error"
                    >
                      Delete
                    </Button>
                  </DialogActions>
                </Dialog>
              </CardActions>
            )}
            {context.isCustomer && (
              <CardActions className={classes.actionButtons}>
                <Tooltip
                  title="View Vendor Profile"
                  aria-label="View Vendor Profile"
                >
                  <IconButton onClick={handleVendorProfile}>
                    <ProfileIcon
                      sx={{
                        color: "#f5f5f5",
                      }}
                    />
                  </IconButton>
                </Tooltip>
              </CardActions>
            )}
          </CardMedia>
          <CardContent>
            <Typography gutterBottom variant="h4" component="h2">
              {kitchen.name}
            </Typography>
            <Typography variant="body1" color="textSecondary" component="p">
              {kitchen.description}
            </Typography>
          </CardContent>
          <Divider
            sx={{
              my: 1,
            }}
          />
          <CardContent>
            <ProductList kitchenId={kitchenId} />
          </CardContent>
        </Card>
      </Slide>
    </div>
  );
};

const PublicKitchen = () => {
  return <ViewKitchen />;
};

const VendorKitchen = () => {
  return <ViewKitchen />;
};

export { PublicKitchen, VendorKitchen };
