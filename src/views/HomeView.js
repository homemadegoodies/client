import React from "react";
import { Container, Grid } from "@mui/material";
import { PublicKitchens } from "../components/kitchen/index";

export default function HomeView() {
  return (
    <Container maxWidth="lg">
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12}>
          <PublicKitchens />
          <br />
        </Grid>
      </Grid>
    </Container>
  );
}
