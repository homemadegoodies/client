import React from "react";
import { Grid, Typography, Box } from "@mui/material";
import HubIcon from "@mui/icons-material/Hub";
import DinnerDiningIcon from "@mui/icons-material/DinnerDining";
import LocalGroceryStoreIcon from "@mui/icons-material/LocalGroceryStore";
import useStyles from "../../hooks/useStyles";

export default function Section() {
  const classes = useStyles();

  const sectionItems = [
    {
      id: 1,
      icon: <LocalGroceryStoreIcon sx={{ fontSize: 150 }} color="primary" />,
      sentence:
        "A digital marketplace for homemade foods that connects home cooks with food lovers",
    },
    {
      id: 2,
      icon: <DinnerDiningIcon sx={{ fontSize: 150 }} color="primary" />,
      sentence:
        "Celebrating cherished family recipes, with wholesome and authentic flavors",
    },
    {
      id: 3,
      icon: <HubIcon sx={{ fontSize: 150 }} color="primary" />,
      sentence: "Join us now and embrace the joy of homemade goodness!",
    },
  ];
  return (
    <Box sx={{ flexGrow: 1, minHeight: "400px" }}>
      <Grid container className={classes.sectionGridContainer}>
        {sectionItems.map((item) => (
          <Grid
            item
            xs={12}
            md={3.5}
            minHeight={300}
            key={item.id}
            className={classes.sectionGridItem}
          >
            {item.icon}
            <Typography>{item.sentence}</Typography>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
