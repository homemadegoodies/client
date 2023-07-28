import React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeIcon from "@mui/icons-material/Home";
import CartIcon from "@mui/icons-material/ShoppingCart";
import Favecon from "@mui/icons-material/Favorite";
import OrderIcon from "@mui/icons-material/Receipt";
import Divider from "@mui/material/Divider";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate } from "react-router";
import useStateContext from "../../hooks/useStateContext";

export default function ViwerListItems() {
  const navigate = useNavigate();
  const { context, resetContext } = useStateContext();
  const handleLogoutClick = () => {
    resetContext();
    navigate("/");
  };
  // console.log(context);

  return (
    <React.Fragment>
      <ListItemButton onClick={() => navigate("/customer/home")}>
        <ListItemIcon>
          <HomeIcon />
        </ListItemIcon>
        <ListItemText primary="Home" />
      </ListItemButton>

      <ListItemButton onClick={() => navigate(`/customer/${context.id}/faves`)}>
        <ListItemIcon>
          <Favecon />
        </ListItemIcon>
        <ListItemText primary="Faves" />
      </ListItemButton>

      <ListItemButton onClick={() => navigate(`/customer/${context.id}/carts`)}>
        <ListItemIcon>
          <CartIcon />
        </ListItemIcon>
        <ListItemText primary="Carts" />
      </ListItemButton>

      <ListItemButton
        onClick={() => navigate(`/customer/${context.id}/orders`)}
      >
        <ListItemIcon>
          <OrderIcon />
        </ListItemIcon>
        <ListItemText primary="Orders" />
      </ListItemButton>

      <Divider sx={{ my: 1 }} />
      <ListItemButton onClick={() => navigate(`/customer/${context.id}`)}>
        <ListItemIcon>
          <PersonIcon />
        </ListItemIcon>
        <ListItemText primary="Profile" />
      </ListItemButton>
      <ListItemButton onClick={handleLogoutClick}>
        <ListItemIcon>
          <LogoutIcon />
        </ListItemIcon>
        <ListItemText primary="Logout" />
      </ListItemButton>
    </React.Fragment>
  );
}
