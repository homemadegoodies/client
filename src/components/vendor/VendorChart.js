import React from "react";
import {
  Box,
  Grid,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function VendorInbox() {
  return (
    <div>
      <Box sx={{ width: "100%" }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="inbox-content"
                id="inbox-header"
              >
                <Typography variant="h6" component="div">
                  Your inbox
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>Your inbox is currently empty.</Typography>
              </AccordionDetails>
            </Accordion>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}
