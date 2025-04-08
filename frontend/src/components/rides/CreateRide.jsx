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
import { MenuItem, Chip, Autocomplete } from "@mui/material";

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
    departureTime: "",
    arrivalTime: "",
    paymentMethods: [],
  });

  const allPaymentOptions = [
    "UPI",
    "Cash",
    "Card",
    "NetBanking",
    "Wallet",
    "Paytm",
    "GPay",
    "PhonePe",
    "Other",
  ];
  const [customPayment, setCustomPayment] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
          customPayment.trim()
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
                    label="Departure Time"
                    name="departureTime"
                    type="time"
                    value={formData.departureTime || ""}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Arrival Time"
                    name="arrivalTime"
                    type="time"
                    value={formData.arrivalTime || ""}
                    onChange={handleChange}
                  />
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
                          style: {
                            maxHeight: 300,
                          },
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
