import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createAPIEndpoint, ENDPOINTS } from "../../api";
import useStateContext from "../../hooks/useStateContext";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Grid,
  Typography,
  CircularProgress,
  Box,
  Slide,
  CardActions,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
  Alert,
  Tooltip,
} from "@mui/material";
import ProfilePicture from "../../assets/profile-picture.png";
import ReportIcon from "@mui/icons-material/Report";
import CustomerForm from "./CustomerForm";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function CustomerCard() {
  const { customerId } = useParams();
  const { vendorId } = useParams();
  const navigate = useNavigate();
  const { context, setContext } = useStateContext();
  const [loading, setLoading] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [openReportCustomerDialog, setOpenReportCustomerDialog] =
    useState(false);
  const [reportReason, setReportReason] = useState("");
  const [customer, setCustomer] = useState(null);

  const fetchCustomer = async () => {
    const response = await createAPIEndpoint(ENDPOINTS.customers).fetchById(
      customerId
    );
    setCustomer(response.data);
  };

  useEffect(() => {
    setLoading(true);
    fetchCustomer();
    setLoading(false);
  }, []);

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

  const handleEdit = () => {
    setOpenEditDialog(true);
  };

  const handleEditCancel = () => {
    setOpenEditDialog(false);
  };

  const handleDelete = () => {
    setOpenDeleteDialog(true);
  };

  const handleReportCustomer = () => {
    setOpenReportCustomerDialog(true);
  };

  const handleSave = (updatedData) => {
    createAPIEndpoint(ENDPOINTS.customers)
      .put(customerId, updatedData)
      .then((res) => {
        setOpenEditDialog(false);
        setCustomer({
          ...customer,
          ...updatedData,
        });
        setContext({
          ...context,
          ...updatedData,
        });
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <div>
        {showSuccessAlert && (
          <Alert severity="success" onClose={() => setShowSuccessAlert(false)}>
            Report submitted successfully!
          </Alert>
        )}
        {showErrorAlert && (
          <Alert severity="error" onClose={() => setShowErrorAlert(false)}>
            Something went wrong!
          </Alert>
        )}
        <br />
      </div>
      {!loading && customer !== null && (
        <Slide in={true} direction="up" mountOnEnter unmountOnExit>
          <Card
            sx={{
              opacity: loading ? 0.5 : 1,
              transition: "opacity 1s",
            }}
          >
            <CardContent>
              {!loading && (
                <Box>
                  {context.id === customerId && (
                    <CardActions>
                      <IconButton
                        onClick={handleEdit}
                        sx={{
                          marginLeft: "auto",
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <Dialog open={openEditDialog} onClose={handleEditCancel}>
                        <DialogTitle>Edit Account</DialogTitle>
                        <DialogContent>
                          <CustomerForm
                            handleEditCancel={handleEditCancel}
                            customerId={customerId}
                            customerData={customer}
                            onSave={(updatedData) => {
                              handleSave(updatedData);
                              setOpenEditDialog(false);
                            }}
                          />
                        </DialogContent>
                      </Dialog>
                      <IconButton
                        onClick={handleDelete}
                        sx={{
                          marginLeft: "auto",
                          color: "error.main",
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                      <Dialog
                        open={openDeleteDialog}
                        onClose={() => setOpenDeleteDialog(false)}
                      >
                        <DialogTitle>Delete Account</DialogTitle>
                        <DialogContent>
                          <DialogContentText>
                            Are you sure you want to delete your account?
                          </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                          <Button
                            onClick={() => setOpenDeleteDialog(false)}
                            color="primary"
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={() => {
                              createAPIEndpoint(ENDPOINTS.customers)
                                .delete(customerId)
                                .then((res) => {
                                  setOpenDeleteDialog(false);
                                  navigate("/");
                                })
                                .catch((err) => console.log(err));
                            }}
                            color="error"
                          >
                            Delete
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </CardActions>
                  )}

                  {context.isVendor && (
                    <CardActions>
                      <Tooltip
                        title="Report Customer"
                        aria-label="Report Customer"
                      >
                        <IconButton
                          sx={{
                            marginLeft: "auto",
                          }}
                          onClick={handleReportCustomer}
                        >
                          <ReportIcon
                            sx={{
                              color: "error.main",
                            }}
                          />
                        </IconButton>
                      </Tooltip>
                      <Dialog
                        open={openReportCustomerDialog}
                        onClose={() => setOpenReportCustomerDialog(false)}
                      >
                        <DialogTitle>Report Customer</DialogTitle>
                        <DialogContent>
                          Are you sure you want to report this customer?
                          <br />
                          <br />
                          <TextField
                            id="outlined-multiline-static"
                            label="Reason"
                            multiline
                            fullWidth
                            rows={4}
                            variant="outlined"
                            placeholder="Enter your reason here"
                            name="reason"
                            value={reportReason}
                            onChange={(e) => setReportReason(e.target.value)}
                            autoFocus
                          />
                        </DialogContent>
                        <DialogActions>
                          <Button
                            onClick={() => setOpenReportCustomerDialog(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={() => {
                              setOpenReportCustomerDialog(false);
                              createAPIEndpoint(ENDPOINTS.reports)
                                .postCustomerReport(customerId, vendorId, {
                                  customerId: customerId,
                                  vendorId: vendorId,
                                  reason: reportReason,
                                })
                                .then((res) => {
                                  setReportReason("");
                                  setShowSuccessAlert(true);
                                })
                                .catch((err) => {
                                  console.log(err);
                                  setShowErrorAlert(true);
                                });
                            }}
                            color="error"
                            disabled={reportReason === ""}
                          >
                            Report
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </CardActions>
                  )}

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <img
                        src={
                          customer.profilePicture
                            ? customer.profilePicture
                            : ProfilePicture
                        }
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
                          {customer.firstName} {customer.lastName}
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                          Username: {customer.username}
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                          Email: {customer.email}
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                          Phone number: {customer.phoneNumber}
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                          Address: {customer.address}
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                          Postal Code: {customer.postalCode}
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                          City: {customer.city}
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                          Province: {customer.province}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </CardContent>
          </Card>
        </Slide>
      )}
    </div>
  );
}
