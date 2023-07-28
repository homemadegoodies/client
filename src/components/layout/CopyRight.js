import React from "react";
import { Typography } from "@mui/material";
import Link from "@mui/material/Link";

export default function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link
        color="inherit"
        href="https://github.com/orgs/homemadegoodies/repositories"
      >
        Homemade Goodies
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}
