import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useStateContext from "../../hooks/useStateContext";
import { createAPIEndpoint, ENDPOINTS } from "../../api";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  CircularProgress,
  Button,
  Grid,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
    transition: "transform 0.3s",
    "&:hover": {
      transform: "scale(1.02)",
      cursor: "pointer",
    },
    "&:hover .MuiCardActions-root": {
      visibility: "visible",
      transition: "visibility 0s, opacity 0.5s linear",
      opacity: 1,
    },
  },
  media: {
    height: 140,
    paddingTop: "56.25%", // 16:9 aspect ratio
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

const KitchenCard = ({ kitchenId }) => {
  const classes = useStyles();
  const [kitchen, setKitchen] = useState(null);
  const [open, setOpen] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const { context } = useStateContext();
  const navigate = useNavigate();

  useEffect(() => {
    createAPIEndpoint(ENDPOINTS.kitchens)
      .fetchById(kitchenId)
      .then((res) => setKitchen(res.data))
      .catch((err) => console.log(err));
  }, [kitchenId]);

  const handleKitchenClick = (e) => {
    if (isButtonClicked) {
      setIsButtonClicked(false);
    } else {
      let link = `/kitchens/${kitchenId}`;
      if (context.isCustomer) {
        link = `/customer/kitchens/${kitchenId}`;
      } else if (context.isVendor && context.id && kitchen.vendorId) {
        link = `/vendor/kitchens/${kitchenId}`;
      }
      navigate(link);
    }
  };

  const handleEdit = (e) => {
    setIsButtonClicked(true);
    e.stopPropagation();
    navigate(`/vendor/kitchens/edit/${kitchenId}`);
  };

  const handleDialogOpen = () => {
    setOpen(true);
  };

  const handleDialogClose = () => {
    setOpen(false);
  };

  const handleDeleteConfirm = (e) => {
    setIsButtonClicked(true);
    setIsDeleting(true);
    e.stopPropagation();
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

  if (!kitchen && !isDeleted) {
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

  const editAndDeleteActions = context.isVendor &&
    context.id === kitchen.vendorId && (
      <CardActions className={classes.actions}>
        <IconButton aria-label="edit" color="primary" onClick={handleEdit}>
          <Edit />
        </IconButton>
        <IconButton
          aria-label="delete"
          color="error"
          onClick={handleDeleteConfirm}
        >
          <Delete />
        </IconButton>
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
    );

  return (
    <Card
      className={`${classes.root} ${isDeleting ? classes.fadeOut : ""}`}
      onClick={handleKitchenClick}
      style={{ cursor: "pointer" }}
    >
      <CardMedia
        className={classes.media}
        image={kitchen.imageURL}
        name={kitchen.name}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="h2">
          {kitchen.name}
        </Typography>
        <Typography variant="body2" color="textSecondary" component="p">
          {kitchen.description}
        </Typography>
        <br />
        <Grid container justifyContent="space-between">
          <Grid item>
            <Typography variant="body2" color="textSecondary" component="p">
              {kitchen.category}
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="body2" color="textSecondary" component="p">
              {kitchen.city}
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="body2" color="textSecondary" component="p">
              {kitchen.prices}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
      {editAndDeleteActions}
    </Card>
  );
};

export default KitchenCard;
