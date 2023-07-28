import React from "react";
import { Grid, Typography, Box } from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import HubIcon from "@mui/icons-material/Hub";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import useStyles from "../../hooks/useStyles";

export default function Section() {
  const classes = useStyles();

  const sectionItems = [
    {
      id: 1,
      icon: <SchoolIcon sx={{ fontSize: 100 }} color="primary" />,
      sentence:
        "Digital Fuse is the ultimate platform for Arabic-speaking seniors to learn how to use technology to stay connected and start businesses.",
    },
    {
      id: 2,
      icon: <HubIcon sx={{ fontSize: 100 }} color="primary" />,
      sentence:
        "Our web app guides seniors through popular applications like Gmail, YouTube, and WhatsApp, making it easy for them to stay connected and succeed in the digital age.",
    },
    {
      id: 3,
      icon: <OndemandVideoIcon sx={{ fontSize: 100 }} color="primary" />,
      sentence:
        "With step-by-step instructions and video products, Digital Fuse empowers seniors to become tech-savvy. Join us today and start your journey to digital success!",
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
