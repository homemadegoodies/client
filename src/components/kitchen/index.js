import React, { useState, useEffect } from "react";
import useStateContext from "../../hooks/useStateContext";
import { createAPIEndpoint, ENDPOINTS } from "../../api";
import { useNavigate } from "react-router-dom";
import KitchenCard from "./KitchenCard";
import { Grid, Slide, Zoom, TextField, Button, MenuItem } from "@mui/material";

const KitchenList = () => {
  const [kitchens, setKitchens] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCity, setSelectedPlatform] = useState("");
  const [selectedPrices, setSelectedPrices] = useState("");
  const { context } = useStateContext();
  const navigate = useNavigate();

  useEffect(() => {
    createAPIEndpoint(ENDPOINTS.kitchens)
      .fetchAll()
      .then((res) => setKitchens(res.data))
      .catch((err) => console.log(err));
  }, [selectedCategory, selectedCity, selectedPrices]);

  const filteredKitchens = kitchens.filter(
    (kitchen) =>
      kitchen.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedCategory === "" || kitchen.category === selectedCategory) &&
      (selectedCity === "" || kitchen.city === selectedCity) &&
      (selectedPrices === "" || kitchen.prices === selectedPrices)
  );

  const handleAddKitchen = () => {
    navigate(`/vendor/kitchens/add`);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleCityChange = (event) => {
    setSelectedPlatform(event.target.value);
  };

  const handlePricesChange = (event) => {
    setSelectedPrices(event.target.value);
  };

  return (
    <Slide in={true} direction="up" mountOnEnter unmountOnExit>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ width: "90%" }}>
          {context.isVendor && context.id && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddKitchen}
              sx={{ float: "right", mb: 2 }}
            >
              Add a Kitchen
            </Button>
          )}

          <TextField
            label="Search kitchens"
            variant="outlined"
            fullWidth
            margin="normal"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ mb: 2 }}
          />

          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <TextField
                select
                label="Category"
                value={selectedCategory}
                onChange={handleCategoryChange}
                variant="outlined"
                fullWidth
                margin="normal"
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Italian">Italian</MenuItem>
                <MenuItem value="Greek">Greek</MenuItem>
                <MenuItem value="Middle Eastern">Middle Eastern</MenuItem>
                <MenuItem value="Chinese">Chinese</MenuItem>
                <MenuItem value="Indian">Indian</MenuItem>
                <MenuItem value="Japanese">Japanese</MenuItem>
                <MenuItem value="Korean">Korean</MenuItem>
                <MenuItem value="Thai">Thai</MenuItem>
                <MenuItem value="Mexican">Mexican</MenuItem>
                <MenuItem value="Caribbean">Caribbean</MenuItem>
                <MenuItem value="American">American</MenuItem>
                <MenuItem value="Canadian">Canadian</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                select
                label="City"
                value={selectedCity}
                onChange={handleCityChange}
                variant="outlined"
                fullWidth
                margin="normal"
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Hamilton">Hamilton</MenuItem>
                <MenuItem value="Toronto">Toronto</MenuItem>
                <MenuItem value="Mississauga">Mississauga</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                select
                label="Prices"
                value={selectedPrices}
                onChange={handlePricesChange}
                variant="outlined"
                fullWidth
                margin="normal"
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="$">$</MenuItem>
                <MenuItem value="$$">$$</MenuItem>
                <MenuItem value="$$$">$$$</MenuItem>
              </TextField>
            </Grid>
          </Grid>
          <br />

          <Grid container spacing={3}>
            {filteredKitchens.map((kitchen) => (
              <Grid item key={kitchen.id} xs={12} sm={6} md={4}>
                <Zoom in={true} style={{ transitionDelay: "200ms" }}>
                  <div>
                    <KitchenCard kitchenId={kitchen.id} />
                  </div>
                </Zoom>
              </Grid>
            ))}
          </Grid>
        </div>
      </div>
    </Slide>
  );
};

const PublicKitchens = () => {
  return <KitchenList />;
};

const CustomerHome = () => {
  return <KitchenList />;
};

const VendorHome = () => {
  return <KitchenList />;
};

export { PublicKitchens, CustomerHome, VendorHome };
