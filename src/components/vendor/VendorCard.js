import React from "react";
import useStateContext from "../../hooks/useStateContext";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Grid,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";
import ProfilePicture from "../../assets/profile-picture.png";

export default function VendorCard() {
  const { context } = useStateContext();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }

  return (
    <Card
      sx={{
        opacity: loading ? 0.5 : 1,
        transition: "opacity 1s",
      }}
    >
      <CardContent>
        {loading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <CircularProgress />
          </Box>
        )}
        {!loading && (
          <Box>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <img
                  src={ProfilePicture}
                  alt="Profile"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "1%",
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                  }}
                >
                  <Typography variant="h5" component="div">
                    {context.name}
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    Username: {context.username}
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    Email: {context.email}
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    Phone number: {context.phoneNumber}
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    Address: {context.address}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
