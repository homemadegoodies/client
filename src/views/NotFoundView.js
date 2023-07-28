import React from "react";
import { Typography, Link } from "@mui/material";

export default function NotFoundView() {
  return (
    <div>
      <Typography variant="h3" align="center" color="text.primary" gutterBottom>
        Page not found
      </Typography>
      <Typography variant="h6" align="center" color="text.secondary" paragraph>
        The page you are looking for does not exist. Please{" "}
        <Link href="/">click here</Link> to return to the home page.
      </Typography>
    </div>
  );
}
