import React from "react";
import Copyright from "./CopyRight";
import { Box, Container } from "@mui/material";

export default function Footer() {
  return (
    <div>
      <Box
        sx={{
          bgcolor: "#222222",
          position: "fixed",
          bottom: 0,
          width: "100%",
          height: "50px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Container maxWidth="sm">
          <Copyright sx={{ color: "white" }} />
        </Container>
      </Box>
    </div>
  );
}
