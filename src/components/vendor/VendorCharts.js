import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { createAPIEndpoint, ENDPOINTS } from "../../api";
import {
  Card,
  Slide,
  Grid,
  TextField,
  MenuItem,
  Grow,
  CircularProgress,
  LinearProgress,
} from "@mui/material";
import { Chart } from "react-google-charts";
import { format } from "date-fns";

const VendorCharts = () => {
  const [loading, setLoading] = useState(false);
  const [vendorOrders, setVendorOrders] = useState([]);
  const [vendorFaves, setVendorFaves] = useState([]);
  const [vendorKitchens, setVendorKitchens] = useState([]);
  const [vendorProducts, setVendorProducts] = useState([]);
  const [noDataMessage, setNoDataMessage] = useState("");
  const [selectedChart, setSelectedChart] = useState("Total Sales");
  const [selectedTime, setSelectedTime] = useState("7 Days");
  const { vendorId } = useParams();

  const fetchOrders = async () => {
    await createAPIEndpoint(ENDPOINTS.orders)
      .fetchByVendorId(vendorId)
      .then((res) => {
        const data = res.data.filter((order) => order.vendorId === vendorId);
        setVendorOrders(data);
      })
      .catch((err) => console.log(err));
  };

  const fetchKitchens = async () => {
    await createAPIEndpoint(ENDPOINTS.kitchens)
      .fetchAll()
      .then((res) => {
        const data = res.data.filter(
          (kitchen) => kitchen.vendorId === vendorId
        );
        setVendorKitchens(data);
      })
      .catch((err) => console.log(err));
  };

  const kitchenId = vendorKitchens.map((kitchen) => kitchen.id);

  const fetchProducts = async () => {
    if (kitchenId) {
      await Promise.all(
        kitchenId.map((id) =>
          createAPIEndpoint(ENDPOINTS.products)
            .fetchByKitchenId(id)
            .then((res) => {
              setVendorProducts((prev) => [...prev, ...res.data]);
            })
            .catch((err) => console.log(err))
        )
      );
    }
  };

  const fetchFaves = async () => {
    if (kitchenId) {
      const favesData = await Promise.all(
        kitchenId.map((id) =>
          createAPIEndpoint(ENDPOINTS.faves)
            .fetchByKitchenId(id)
            .then((res) => res.data)
            .catch((err) => {
              console.log(err);
              return []; // Return an empty array in case of an error
            })
        )
      );

      // Concatenate all the fetched data arrays
      const mergedFavesData = favesData.flat();

      // Update state only if the mergedFavesData is not empty
      if (mergedFavesData.length > 0) {
        setVendorFaves(mergedFavesData);
      }
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchOrders();
    setLoading(false);
  }, []);

  useEffect(() => {
    if (vendorOrders.length > 0) {
      fetchKitchens();
    }
  }, [vendorOrders]);

  useEffect(() => {
    if (vendorKitchens.length > 0) {
      fetchProducts();
      fetchFaves();
    }
  }, [vendorKitchens]);

  const handleChartChange = (event) => {
    setSelectedChart(event.target.value);
  };

  const handleTimeChange = (event) => {
    setSelectedTime(event.target.value);
  };

  const mapProductIdToName = (productId) => {
    const product = vendorProducts.find((product) => product.id === productId);
    return product ? product.name : "";
  };

  const fetchDataForChart = () => {
    if (selectedChart === "Total Sales") {
      const totalSalesData = [["Product", "Total Sales"]];

      vendorOrders.forEach((order) => {
        order.orderProducts.forEach((product) => {
          const productName = mapProductIdToName(product.productId);
          const existingProductIndex = totalSalesData.findIndex(
            (row) => row[0] === productName
          );
          if (existingProductIndex !== -1) {
            totalSalesData[existingProductIndex][1] += product.quantity;
          } else {
            totalSalesData.push([productName, product.quantity]);
          }
        });
      });

      return totalSalesData;
    }

    if (selectedChart === "Recent Sales") {
      const dateFilter = new Date();
      dateFilter.setDate(
        dateFilter.getDate() - (selectedTime === "7 Days" ? 7 : 30)
      );

      const recentSalesData = [["Date", "Sales"]];

      vendorOrders.forEach((order) => {
        const orderDate = new Date(order.createdAt);
        if (orderDate >= dateFilter) {
          const formattedDate = format(orderDate, "MMM d, yyyy"); // Format date using date-fns library
          const existingDateIndex = recentSalesData.findIndex(
            (row) => row[0] === formattedDate
          );
          if (existingDateIndex !== -1) {
            recentSalesData[existingDateIndex][1]++;
          } else {
            recentSalesData.push([formattedDate, 1]);
          }
        }
      });

      return recentSalesData;
    }

    if (selectedChart === "Most Faved") {
      if (vendorFaves.length === 0) {
        setNoDataMessage("No favorites found.");
      } else {
        const mostFavedData = [["Product", "Faves"]];

        vendorFaves.forEach((fave) => {
          fave.faveProducts.forEach((product) => {
            const productName = mapProductIdToName(product.productId);
            const existingProductIndex = mostFavedData.findIndex(
              (row) => row[0] === productName
            );
            if (existingProductIndex !== -1) {
              mostFavedData[existingProductIndex][1]++;
            } else {
              mostFavedData.push([productName, 1]);
            }
          });
        });

        return mostFavedData;
      }
    }
  };

  const chartOptions = {
    // title: "Sales and Faves",
    curveType: "function",
    legend: { position: "bottom" },
    vAxis: {
      // Flipped vAxis to hAxis
      title: "Date",
      format: "M/d/yy",
    },
    hAxis: {
      // Flipped hAxis to vAxis
      title: "Amount",
    },
  };

  const reportOptions = [
    { value: "Total Sales", label: "Total Sales" },
    { value: "Recent Sales", label: "Recent Sales" },
    { value: "Most Faved", label: "Most Faved" },
  ];

  const timeOptions = [
    { value: "7 Days", label: "7 Days" },
    { value: "30 Days", label: "30 Days" },
  ];

  if (loading) {
    return (
      <Card
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "300px",
          width: "100%",
          opacity: 0.5,
          transition: "opacity 0.5s ease-out",
          backgroundColor: "transparent",
          boxShadow: "none",
        }}
      >
        <CircularProgress />
      </Card>
    );
  }

  return (
    <Slide in={true} direction="left" mountOnEnter unmountOnExit>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ width: "90%" }}>
          {noDataMessage ? (
            <Card
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "300px",
                width: "100%",
                opacity: 0.5,
                transition: "opacity 0.5s ease-out",
                backgroundColor: "transparent",
                boxShadow: "none",
              }}
            >
              {noDataMessage}
            </Card>
          ) : (
            <>
              <Grow in={true} timeout={1000}>
                <Card>
                  <Chart
                    width={"100%"}
                    height={"400px"}
                    chartType="PieChart"
                    loader={<LinearProgress />}
                    data={fetchDataForChart()}
                    options={chartOptions}
                  />
                </Card>
              </Grow>
              <br />

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    label="Chart"
                    value={selectedChart}
                    onChange={handleChartChange}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                  >
                    {reportOptions.map((status) => (
                      <MenuItem key={status.value} value={status.value}>
                        {status.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    label="Time"
                    value={selectedTime}
                    onChange={handleTimeChange}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                  >
                    {timeOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
            </>
          )}
        </div>
      </div>
    </Slide>
  );
};

export default VendorCharts;
