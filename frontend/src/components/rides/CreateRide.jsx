import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
} from "@mui/material";
import { MenuItem, Chip} from "@mui/material";

import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { rideService } from "../../services/api";
import { toast } from "react-toastify";

const CreateRide = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    origin: "",
    destination: "",
    date: new Date(),
    seats: 1,
    price: "",
    preferredCommunication: "",
    ridePreference: {
      music: true,
      ac: true,
      womenOnly: true,
      luggage: true,
      smoking: true,
    },
    paymentMethods: [],
  });

  const communicationPrefs = ["Chat", "Call", "Both"];

  const allPaymentOptions = ["UPI", "Cash", "QR", "Other"];

  const [qrImage, setQrImage] = useState(null);

  const [customPayment, setCustomPayment] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleNestedChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const handleDateChange = (newDate) => {
    setFormData({
      ...formData,
      date: newDate,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      //  Add custom payment if not already handled
      if (showCustomInput && customPayment.trim()) {
        formData.paymentMethods = [
          ...formData.paymentMethods.filter((m) => m !== "Other"),
          customPayment.trim(),
        ];
      }

      await rideService.createRide({
        ...formData,
        price: parseFloat(formData.price),
        seats: parseInt(formData.seats),
        paymentMethods: formData.paymentMethods,
      });

      toast.success("Ride created successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error creating ride:", error);
      if (
        error.response?.status === 400 &&
        error.response.data?.missingFields
      ) {
        const missingFields = error.response.data.missingFields;
        const message = `Please complete the following fields in your profile: ${missingFields.join(
          ", "
        )}`;

        toast.error(message);
        navigate("/profile");
      } else {
        toast.error(error.response?.data?.message || "Failed to create ride");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="lg">
      <Box
        sx={{
          marginTop: 15,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 7,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Box
            sx={{
              flex: 1,
              backgroundImage: "url(/ride.jpg)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              minHeight: 400,
              transition: "transform 0.3s ease-in-out",
              "&:hover": {
                transform: "scale(1.1)",
              },
            }}
          />
          <Box
            sx={{
              flex: 1,
              paddingLeft: 4,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography component="h1" variant="h5" gutterBottom>
              Create a New Ride
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Origin"
                    name="origin"
                    value={formData.origin}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Destination"
                    name="destination"
                    value={formData.destination}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DateTimePicker
                      label="Date and Time"
                      value={formData.date}
                      onChange={handleDateChange}
                      renderInput={(params) => (
                        <TextField {...params} fullWidth />
                      )}
                      minDateTime={new Date()}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Available Seats"
                    name="seats"
                    type="number"
                    value={formData.seats}
                    onChange={handleChange}
                    InputProps={{ inputProps: { min: 1 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Price per Seat"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                    InputProps={{ inputProps: { min: 0, step: 0.01 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    label="Music Preference"
                    fullWidth
                    sx={{ my: 1 }}
                    value={
                      formData.ridePreference.music === true ? "true" : "false"
                    }
                    onChange={(e) =>
                      handleNestedChange(
                        "ridePreference",
                        "music",
                        e.target.value === "true"
                      )
                    }
                  >
                    <MenuItem value="true">Yes</MenuItem>
                    <MenuItem value="false">No</MenuItem>
                  </TextField>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    label="Smoking Preference"
                    fullWidth
                    sx={{ my: 1 }}
                    value={
                      formData.ridePreference.smoking === true
                        ? "true"
                        : "false"
                    }
                    onChange={(e) =>
                      handleNestedChange(
                        "ridePreference",
                        "smoking",
                        e.target.value === "true"
                      )
                    }
                  >
                    <MenuItem value="true">Yes</MenuItem>
                    <MenuItem value="false">No</MenuItem>
                  </TextField>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    label="AC Preference"
                    fullWidth
                    sx={{ my: 1 }}
                    value={
                      formData.ridePreference.ac === true ? "true" : "false"
                    }
                    onChange={(e) =>
                      handleNestedChange(
                        "ridePreference",
                        "ac",
                        e.target.value === "true"
                      )
                    }
                  >
                    <MenuItem value="true">Yes</MenuItem>
                    <MenuItem value="false">No</MenuItem>
                  </TextField>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    label="Luggage Preference"
                    fullWidth
                    sx={{ my: 1 }}
                    value={
                      formData.ridePreference.luggage === true
                        ? "true"
                        : "false"
                    }
                    onChange={(e) =>
                      handleNestedChange(
                        "ridePreference",
                        "luggage",
                        e.target.value === "true"
                      )
                    }
                  >
                    <MenuItem value="true">Yes</MenuItem>
                    <MenuItem value="false">No</MenuItem>
                  </TextField>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    label="Women Only Preference"
                    fullWidth
                    sx={{ my: 1 }}
                    value={
                      formData.ridePreference.womenOnly === true
                        ? "true"
                        : "false"
                    }
                    onChange={(e) =>
                      handleNestedChange(
                        "ridePreference",
                        "womenOnly",
                        e.target.value === "true"
                      )
                    }
                  >
                    <MenuItem value="true">Yes</MenuItem>
                    <MenuItem value="false">No</MenuItem>
                  </TextField>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    label="Preferred Communication"
                    name="preferredCommunication"
                    fullWidth
                    value={formData.preferredCommunication}
                    onChange={handleChange}
                  >
                    {communicationPrefs.map((opt) => (
                      <MenuItem key={opt} value={opt}>
                        {opt}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    select
                    label="Payment Methods"
                    fullWidth
                    SelectProps={{
                      multiple: true,
                      renderValue: (selected) => (
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                        >
                          {selected.map((value) => (
                            <Chip key={value} label={value} />
                          ))}
                        </Box>
                      ),
                      MenuProps: {
                        PaperProps: {
                          style: { maxHeight: 300 },
                        },
                      },
                    }}
                    value={formData.paymentMethods}
                    onChange={(e) => {
                      const {
                        target: { value },
                      } = e;

                      const newValues =
                        typeof value === "string" ? value.split(",") : value;

                      // Track special inputs
                      if (
                        newValues.includes("Other") &&
                        !formData.paymentMethods.includes("Other")
                      ) {
                        setShowCustomInput(true);
                        setCustomPayment("");
                      }

                      setFormData({
                        ...formData,
                        paymentMethods: newValues,
                      });
                    }}
                  >
                    {allPaymentOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>

                  {/* Custom Payment Input */}
                  {showCustomInput && (
                    <TextField
                      fullWidth
                      label="Specify Other Payment Method"
                      value={customPayment}
                      onChange={(e) => setCustomPayment(e.target.value)}
                      onBlur={() => {
                        const trimmed = customPayment.trim();
                        if (trimmed) {
                          setFormData((prev) => ({
                            ...prev,
                            paymentMethods: [
                              ...prev.paymentMethods.filter(
                                (m) => m !== "Other"
                              ),
                              trimmed,
                            ],
                          }));
                        } else {
                          setFormData((prev) => ({
                            ...prev,
                            paymentMethods: prev.paymentMethods.filter(
                              (m) => m !== "Other"
                            ),
                          }));
                        }
                        setShowCustomInput(false);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          e.target.blur();
                        }
                      }}
                      sx={{ mt: 2 }}
                    />
                  )}

                  {/* UPI Field */}
                  {formData.paymentMethods.includes("UPI") && (
                    <TextField
                      fullWidth
                      label="Enter UPI ID"
                      value={formData.upiId || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          upiId: e.target.value,
                        }))
                      }
                      sx={{ mt: 2 }}
                    />
                  )}

                  {/* QR Code Upload */}
                  {formData.paymentMethods.includes("QR") && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" gutterBottom>
                        Upload QR Code Image
                      </Typography>
                      <Button variant="outlined" component="label" fullWidth>
                        Upload QR Image
                        <input
                          type="file"
                          accept="image/*"
                          hidden
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              setQrImage(file);
                            }
                          }}
                        />
                      </Button>

                      {qrImage && (
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="caption">Preview:</Typography>
                          <img
                            src={URL.createObjectURL(qrImage)}
                            alt="QR Code"
                            style={{
                              maxWidth: "100%",
                              maxHeight: "200px",
                              marginTop: 8,
                            }}
                          />
                        </Box>
                      )}
                    </Box>
                  )}
                </Grid>
              </Grid>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3 }}
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Ride"}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default CreateRide;
