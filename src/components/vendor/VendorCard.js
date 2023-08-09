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
import VendorForm from "./VendorForm";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function VendorCard() {
  const { vendorId } = useParams();
  const { customerId } = useParams();
  const navigate = useNavigate();
  const { context, setContext } = useStateContext();
  const [loading, setLoading] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [openReportVendorDialog, setOpenReportVendorDialog] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [vendor, setVendor] = useState(null);

  const fetchVendor = async () => {
    const response = await createAPIEndpoint(ENDPOINTS.vendors).fetchById(
      vendorId
    );
    setVendor(response.data);
  };

  useEffect(() => {
    setLoading(true);
    fetchVendor();
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
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

  const handleReportVendor = () => {
    setOpenReportVendorDialog(true);
  };

  const handleSave = (updatedData) => {
    createAPIEndpoint(ENDPOINTS.vendors)
      .put(vendorId, updatedData)
      .then((res) => {
        setOpenEditDialog(false);
        setContext({ ...context, ...updatedData });
      });
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
      {!loading && vendor !== null && (
        <Slide in={true} direction="up" mountOnEnter unmountOnExit>
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
                  {context.id === vendorId && (
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
                          <VendorForm
                            handleEditCancel={handleEditCancel}
                            vendorId={vendorId}
                            vendorData={context}
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
                              createAPIEndpoint(ENDPOINTS.vendors)
                                .delete(vendorId)
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

                  {context.isCustomer && (
                    <CardActions>
                      <Tooltip title="Report Vendor" aria-label="Report Vendor">
                        <IconButton
                          sx={{
                            marginLeft: "auto",
                          }}
                          onClick={handleReportVendor}
                        >
                          <ReportIcon
                            sx={{
                              color: "error.main",
                            }}
                          />
                        </IconButton>
                      </Tooltip>
                      <Dialog
                        open={openReportVendorDialog}
                        onClose={() => setOpenReportVendorDialog(false)}
                      >
                        <DialogTitle>Report Vendor</DialogTitle>
                        <DialogContent>
                          Are you sure you want to report this vendor?
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
                          />
                        </DialogContent>
                        <DialogActions>
                          <Button
                            onClick={() => setOpenReportVendorDialog(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={() => {
                              setOpenReportVendorDialog(false);
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
                          vendor.profilePicture
                            ? vendor.profilePicture
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
                          {vendor.firstName} {vendor.lastName}
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                          Username: {vendor.username}
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                          Email: {vendor.email}
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                          Phone number: {vendor.phoneNumber}
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                          Address: {vendor.address}
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                          Postal Code: {vendor.postalCode}
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                          City: {vendor.city}
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                          Province: {vendor.province}
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
