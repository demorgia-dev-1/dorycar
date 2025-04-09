import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  TextField,
  Paper,
  IconButton,
  Card,
  CardContent,
  Avatar,
  Divider,
  Chip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { DatePicker } from "@mui/x-date-pickers";
import SearchIcon from "@mui/icons-material/Search";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import SecurityIcon from "@mui/icons-material/Security";
import SavingsIcon from "@mui/icons-material/Savings";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import PersonIcon from "@mui/icons-material/Person";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { Typewriter } from "react-simple-typewriter";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { rideService } from "../../services/api";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Rating,
} from "@mui/material";

const LandingPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    from: "",
    to: "",
    date: null,
    passengers: 1,
  });
  const [showResults, setShowResults] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedRide, setSelectedRide] = useState(null);

  const [move, setMove] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setMove((prev) => !prev);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleSearch = async () => {
    try {
      const hasSearch =
        searchParams.from.trim() || searchParams.to.trim() || searchParams.date;

      if (!hasSearch) {
        toast.warn("Please fill in the search field");
        setSearchResults([]);
        setShowResults(false);
        return;
      }

      const params = {};

      if (searchParams.from.trim()) {
        params.origin = searchParams.from.trim();
      }

      if (searchParams.to.trim()) {
        params.destination = searchParams.to.trim();
      }

      if (searchParams.date instanceof Date && !isNaN(searchParams.date)) {
        params.date = searchParams.date.toISOString();
      }

      const results = await rideService.searchRides(params);
      setSearchResults(results);
      setShowResults(true);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch rides");
    }
  };

  const handleBookRide = async (rideId) => {
    try {
      await rideService.expressInterest(rideId);
      toast.success("Ride booked successfully!");
      setSelectedRide(false);
    } catch (error) {
      toast.error("Failed to book ride");
    }
  };

  const handleChatWithDriver = (driverId) => {
    navigate(`/chat/${driverId}`);
  };

  const handleViewMap = (origin, destination) => {
    const mapUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
      origin
    )}&destination=${encodeURIComponent(destination)}`;
    window.open(mapUrl, "_blank");
  };

  const handleShareRide = (ride) => {
    const shareText = `Ride from ${ride.origin} to ${
      ride.destination
    } on ${new Date(ride.date).toLocaleDateString()} - ₹${
      ride.price
    } per seat.`;

    if (navigator.share) {
      navigator
        .share({
          title: "Ride on DoryCar",
          text: shareText,
          url: window.location.href,
        })
        .catch(console.error);
    } else {
      navigator.clipboard.writeText(shareText + " " + window.location.href);
      toast.info("Ride details copied to clipboard!");
    }
  };

  return (
    <Box>
      <>
        {/* Hero Section with Background Image */}
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ amount: 0.2 }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              height: "80vh",
            }}
          >
            {/* Image Container */}

            <Box
              component="img"
              src="bg1.png"
              alt="Ride with DoryCar"
              sx={{
                height: "auto",
                width: "50%",
                maxHeight: "100%",
                objectFit: "contain",
                transition: "transform 0.3s ease-in-out",
                "&:hover": {
                  transform: "scale(1.1)",
                },
              }}
            />
            {/* Content Container */}
            <Box
              sx={{
                width: "50%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Container maxWidth="md">
                <Grid item xs={12}>
                  <Typography
                    variant="h2"
                    sx={{
                      textAlign: "left",
                      fontSize: "2rem",
                      mb: 5,
                      backgroundColor: "Highlight",
                      color: "white",
                      borderRadius: 10,
                      paddingY: 1,
                      paddingX: 3,
                      width: "fit-content",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Ride with DoryCar
                  </Typography>

                  <Box
                    sx={{
                      display: "inline-block",
                      paddingY: 1,
                      paddingX: 3,
                      borderRadius: 8,
                      background:
                        "linear-gradient(to left, #f3bedc, #e9bde3, #dcbee8, #cebeed, #bebfef, #b2c4f3, #a6c9f4, #9ccdf4, #98d6f4, #9adff2, #a1e6ee, #adede9)",
                    }}
                  >
                    <Typography
                      variant="h5"
                      sx={{
                        textAlign: "left",
                        fontSize: "3.2rem",
                        // fontWeight: "none",
                        color: "white",
                        whiteSpace: "normal",
                        wordWrap: "break-word",
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                        fontWeight: "bold",
                      }}
                    >
                      <span>
                        <Typewriter
                          words={["Connect & Share Ride.."]}
                          loop={0}
                          cursor
                          cursorStyle="|"
                          typeSpeed={50}
                        />
                      </span>
                    </Typography>
                  </Box>
                </Grid>
              </Container>
            </Box>
          </Box>
        </motion.div>

        {/* Form Section (moved below the image) */}
        <Container maxWidth="xl" sx={{ my: 1, mt: -5 }}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              width: "100%",
              maxWidth: "1200px",
              mx: "auto",
              background:
                "linear-gradient(to left, #f3bedc, #e9bde3, #dcbee8, #cebeed, #bebfef, #b2c4f3, #a6c9f4, #9ccdf4, #98d6f4, #9adff2, #a1e6ee, #adede9)",
              boxShadow: 3,
            }}
          >
            <Grid container spacing={3}>
              {/* From */}
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="From"
                  variant="outlined"
                  value={searchParams.from}
                  onChange={(e) =>
                    setSearchParams({
                      ...searchParams,
                      from: e.target.value,
                    })
                  }
                  sx={{ backgroundColor: "white", borderRadius: 2 }}
                />
              </Grid>
              {/* To */}
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="To"
                  variant="outlined"
                  value={searchParams.to}
                  onChange={(e) =>
                    setSearchParams({ ...searchParams, to: e.target.value })
                  }
                  sx={{ backgroundColor: "white", borderRadius: 2 }}
                />
              </Grid>
              {/* Date */}
              <Grid item xs={12} sm={2}>
                <DatePicker
                  label="Date"
                  value={searchParams.date}
                  onChange={(newDate) =>
                    setSearchParams({ ...searchParams, date: newDate })
                  }
                  sx={{
                    width: "100%",
                    backgroundColor: "white",
                    borderRadius: 2,
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </Grid>
              {/* Passengers */}
              <Grid item xs={12} sm={2}>
                <TextField
                  fullWidth
                  // label="Passengers"
                  type="number"
                  variant="outlined"
                  InputProps={{
                    inputProps: { min: 1 },
                    startAdornment: (
                      <PersonIcon sx={{ color: "action.active", mr: 1 }} />
                    ),
                  }}
                  value={searchParams.passengers}
                  onChange={(e) =>
                    setSearchParams({
                      ...searchParams,
                      passengers: parseInt(e.target.value) || 1,
                    })
                  }
                  sx={{ backgroundColor: "white", borderRadius: 2 }}
                />
              </Grid>
              {/* Search Button */}
              <Grid item xs={12} sm={2}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{
                    height: "56px",
                    minWidth: "50px",
                    fontWeight: "bold",
                  }}
                  onClick={handleSearch}
                >
                  <SearchIcon />
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Container>

        {/* Results */}
        {showResults && (
          <Container maxWidth="md" sx={{ my: 4 }}>
            <CardContent>
              <Grid container spacing={2}>
                {/* {searchResults.map((ride) => (
                  <Grid item xs={12} key={ride._id}>
                    <Card
                      onClick={() => setSelectedRide(ride)}
                      sx={{ cursor: "pointer" }}
                    >
                      <CardContent>
                        <Chip
                          label={ride.status}
                          color={
                            ride.status === "completed"
                              ? "success"
                              : ride.status === "pending"
                              ? "warning"
                              : "primary"
                          }
                          size="small"
                        />
                        <Box display="flex" alignItems="center" gap={2}>
                          <Avatar src={ride.creator?.profileImage} />
                        </Box>
                        <Typography>{ride.creator.name}</Typography>
                        <Typography variant="body2">
                          ⭐ {ride.creator?.averageRating?.toFixed(1) || "N/A"}{" "}
                          ({ride.creator?.ratings?.length || 0} rides)
                        </Typography>
                        <Typography variant="h6">
                          {ride.origin} → {ride.destination}
                        </Typography>
                        <Typography>
                          Date: {new Date(ride.date).toLocaleDateString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Time: {new Date(ride.date).toLocaleTimeString()}
                        </Typography>
                        <Typography>Price per Seat: ₹{ride.price}</Typography>
                        <Typography>Available Seats: {ride.seats}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))} */}
                {searchResults.length > 0 ? (
                  searchResults.map((ride) => (
                    <Grid item xs={12} key={ride._id}>
                      <Typography variant="h6" gutterBottom>
                        Available Rides
                      </Typography>
                      <Card
                        onClick={() => setSelectedRide(ride)}
                        sx={{ cursor: "pointer" }}
                      >
                        <CardContent>
                          <Chip
                            label={ride.status}
                            color={
                              ride.status === "completed"
                                ? "success"
                                : ride.status === "pending"
                                ? "warning"
                                : "primary"
                            }
                            size="small"
                          />
                          <Box display="flex" alignItems="center" gap={2}>
                            <Avatar src={ride.creator?.profileImage} />
                          </Box>
                          <Typography>{ride.creator.name}</Typography>
                          <Box display="flex" alignItems="center">
                            <Rating
                              value={ride.creator?.averageRating || 0}
                              precision={0.5}
                              readOnly
                            />
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ ml: 1 }}
                            >
                              (
                              {ride.creator?.averageRating?.toFixed(1) || "N/A"}
                              )
                            </Typography>
                          </Box>

                          <Typography variant="h6">
                            {ride.origin} → {ride.destination}
                          </Typography>
                          <Typography>
                            Date: {new Date(ride.date).toLocaleDateString()}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Time: {new Date(ride.date).toLocaleTimeString()}
                          </Typography>
                          <Typography>Price per Seat: ₹{ride.price}</Typography>
                          <Typography>Available Seats: {ride.seats}</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))
                ) : (
                  <Grid item xs={12}>
                    <Typography
                      variant="h6"
                      align="center"
                      color="text.secondary"
                      sx={{ mt: 4 }}
                    >
                      No ride matches your search.
                    </Typography>
                  </Grid>
                )}

                {selectedRide && (
                  <Dialog
                    open={true}
                    onClose={() => setSelectedRide(null)}
                    fullWidth
                    maxWidth="md"
                  >
                    {/* {console.log("🧾 Selected Ride:", selectedRide)} */}
                    <DialogTitle>Ride Details</DialogTitle>
                    <DialogContent dividers>
                      <Box display="flex" alignItems="center" gap={2} mb={2}>
                        <Avatar src={selectedRide.creator?.profileImage} />
                        <Box sx={{ textTransform: "capitalize" }}>
                          <Typography fontWeight="bold">
                            {selectedRide.creator?.name}
                          </Typography>
                          <Typography variant="body2">
                            ⭐{" "}
                            {selectedRide.creator?.averageRating?.toFixed(1) ||
                              "N/A"}{" "}
                            ({selectedRide.creator?.ratings?.length || 0} rides)
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ textTransform: "capitalize" }}>
                        <Typography>
                          <strong>Gender:</strong>{" "}
                          {selectedRide.creator?.gender}
                        </Typography>
                        <Typography>
                          <strong>Contact: </strong>
                          {selectedRide.creator?.phone}
                        </Typography>
                        <Typography>
                          <strong>Emergency Contact:</strong>{" "}
                          {selectedRide.creator?.emergencyContact}
                        </Typography>
                      </Box>
                      <Divider sx={{ my: 2 }} />
                      {selectedRide.creator?.vehicle ? (
                        <Box sx={{ textTransform: "capitalize" }}>
                          <Typography variant="body2">
                            <strong>Car: </strong>
                            {selectedRide.creator.vehicle.make}
                          </Typography>
                          <Typography>
                            <strong>Model: </strong>
                            {selectedRide.creator.vehicle.model}
                          </Typography>
                          <Typography>
                            <strong>color:</strong>{" "}
                            {selectedRide.creator.vehicle.color}
                          </Typography>
                          <Typography>
                            <strong>VIN: </strong>
                            {selectedRide.creator.vehicle.vin}
                          </Typography>
                          <Typography>
                            <strong>Registration:</strong>{" "}
                            {selectedRide.creator.vehicle.registration}
                          </Typography>
                          <Typography>
                            <strong>Year:</strong>{" "}
                            {selectedRide.creator.vehicle.year}
                          </Typography>
                          <Typography>
                            <strong>Fuel type:</strong>{" "}
                            {selectedRide.creator.vehicle.fuel}
                          </Typography>
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Vehicle info not available
                        </Typography>
                      )}
                      <Divider sx={{ my: 2 }} />
                      <Typography mt={2}>
                        <strong>From:</strong> {selectedRide.origin}
                      </Typography>
                      <Typography>
                        <strong>To:</strong> {selectedRide.destination}
                      </Typography>
                      <Typography>
                        <strong>Price:</strong> ₹{selectedRide.price}
                      </Typography>
                      <Typography>
                        <strong>Departure Time:</strong>{" "}
                        {selectedRide.departureTime || "Not specified"}
                      </Typography>
                      <Typography>
                        <strong>Arrival Time:</strong>{" "}
                        {selectedRide.arrivalTime || "Not specified"}
                      </Typography>

                      {selectedRide.stops?.length > 0 && (
                        <Typography>
                          <strong>Stops:</strong>{" "}
                          {selectedRide.stops.join(", ")}
                        </Typography>
                      )}

                      <Divider sx={{ my: 2 }} />
                      <Typography>
                        <strong>Fare per Seat:</strong> ₹{selectedRide.price}
                      </Typography>
                      <Typography>
                        <strong>Payment Methods:</strong>{" "}
                        {Array.isArray(selectedRide.paymentMethods) &&
                        selectedRide.paymentMethods.length > 0
                          ? selectedRide.paymentMethods.join(", ")
                          : "Not specified"}
                      </Typography>

                      {selectedRide.fareSplitShown && (
                        <Typography color="success.main">
                          Fare Split Available
                        </Typography>
                      )}

                      <Divider sx={{ my: 2 }} />
                      <Typography variant="subtitle2">Preferences:</Typography>
                      <ul>
                        <li>
                          <strong>AC: </strong>
                          {selectedRide.preference?.ac ? " AC" : " No AC"}
                        </li>
                        <li>
                          <strong>Smoking Allowed: </strong>
                          {selectedRide.preferences?.smoking
                            ? "Smoking Allowed"
                            : " No Smoking"}
                        </li>
                        <li>
                          <strong>Music Allowed: </strong>
                          {selectedRide.preferences?.music
                            ? "Music Allowed"
                            : " No Music"}
                        </li>
                        <li>
                          <strong>Luggage Allowed: </strong>
                          {selectedRide.preferences?.luggage
                            ? "Luggage Allowed"
                            : " No Luggage"}
                        </li>
                        <strong>Women-only ride: </strong>{" "}
                        {selectedRide.preferences?.womenOnly && (
                          <li>Women-only ride</li>
                        )}
                      </ul>

                      <Divider sx={{ my: 2 }} />
                      <Typography variant="subtitle2">
                        Verifications:
                      </Typography>
                      <ul>
                        <li>
                          <strong>ID: </strong>
                          {selectedRide.verified?.id
                            ? "ID Verified"
                            : " ID Not Verified"}
                        </li>
                        <li>
                          <strong>Phone: </strong>
                          {selectedRide.verified?.phone
                            ? " Phone Verified"
                            : " Phone Not Verified"}
                        </li>
                        <li>
                          <strong>License: </strong>
                          {selectedRide.verified?.license
                            ? " License Verified"
                            : " License Not Verified"}
                        </li>
                        <li>
                          <strong>Emergency Contact: </strong>
                          {selectedRide.verified?.emergencyContact
                            ? " Emergency Contact Available"
                            : "Not Provided"}
                        </li>
                      </ul>
                    </DialogContent>

                    <DialogActions>
                      <Button
                        onClick={() => {
                          handleBookRide(selectedRide._id);
                          navigate("/dashboard");
                        }}
                        variant="contained"
                        color="primary"
                      >
                        Book
                      </Button>

                      <Button
                        onClick={() =>
                          handleChatWithDriver(selectedRide.creator._id)
                        }
                        variant="outlined"
                      >
                        Chat
                      </Button>
                      <Button
                        onClick={() =>
                          handleViewMap(
                            selectedRide.origin,
                            selectedRide.destination
                          )
                        }
                        variant="outlined"
                      >
                        Map
                      </Button>
                      <Button
                        onClick={() => handleShareRide(selectedRide)}
                        variant="text"
                      >
                        Share
                      </Button>
                      <Button
                        onClick={() => setSelectedRide(null)}
                        color="error"
                      >
                        Close
                      </Button>
                    </DialogActions>
                  </Dialog>
                )}
              </Grid>
            </CardContent>
          </Container>
        )}
      </>

      {/* Services Section */}

      <Box sx={{ py: 8, backgroundColor: "background.default" }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            textAlign="center"
            gutterBottom
            sx={{
              mb: 6,
              transition: "margin-bottom 0.3s ease-in-out",
            }}
          >
            Our Services
          </Typography>
          <Grid container spacing={4} sx={{ mt: 4 }}>
            <Grid item xs={12} md={4}>
              <motion.div
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                viewport={{ amount: 0.2 }}
              >
                <Box
                  sx={{
                    "&:hover .hover-icon": {
                      color: "white",
                    },
                    "&:hover .hover-card": {
                      boxShadow: "0px 8px 16px rgba(0,0,0,0.2)",
                      transform: "scale(1.05) translateY(-50px)",
                      background:
                        "radial-gradient(#f3bedc, #e9bde3, #dcbee8, #cebeed, #bebfef, #b2c4f3, #a6c9f4, #9ccdf4, #98d6f4, #9adff2, #a1e6ee, #adede9)",
                      color: "white",
                    },
                  }}
                >
                  <Card
                    className="hover-card"
                    sx={{
                      height: "100%",
                      textAlign: "center",
                      p: 3,
                      transition:
                        "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                      background:
                        "linear-gradient(to left, #f3bedc, #e9bde3, #dcbee8, #cebeed, #bebfef, #b2c4f3, #a6c9f4, #9ccdf4, #98d6f4, #9adff2, #a1e6ee, #adede9)",
                      color: "white",
                    }}
                  >
                    <DirectionsCarIcon
                      className="hover-icon"
                      sx={{
                        fontSize: 60,
                        // color: "primary.main",
                        color: "white",
                        mb: 2,
                        transition: "color 0.3s ease-in-out",
                      }}
                    />
                    <CardContent>
                      <Typography variant="h5" gutterBottom>
                        Publish a Ride
                      </Typography>
                      <Typography>
                        Share your journey and reduce travel costs by offering
                        rides to fellow travelers.
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
              </motion.div>
            </Grid>

            <Grid item xs={12} md={4}>
              <motion.div
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                viewport={{ amount: 0.2 }}
              >
                <Box
                  sx={{
                    "&:hover .hover-icon": {
                      color: "white",
                    },
                    "&:hover .hover-card": {
                      boxShadow: "0px 8px 16px rgba(0,0,0,0.2)",
                      transform: "scale(1.05) translateY(-50px)",
                      background:
                        "radial-gradient(#f3bedc, #e9bde3, #dcbee8, #cebeed, #bebfef, #b2c4f3, #a6c9f4, #9ccdf4, #98d6f4, #9adff2, #a1e6ee, #adede9)",
                      color: "white",
                    },
                  }}
                >
                  <Card
                    className="hover-card"
                    sx={{
                      height: "100%",
                      textAlign: "center",
                      p: 3,
                      transition:
                        "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                      background:
                        "linear-gradient(to left, #f3bedc, #e9bde3, #dcbee8, #cebeed, #bebfef, #b2c4f3, #a6c9f4, #9ccdf4, #98d6f4, #9adff2, #a1e6ee, #adede9)",
                      color: "white",
                    }}
                  >
                    <SearchIcon
                      className="hover-icon"
                      sx={{
                        fontSize: 60,
                        // color: "primary.main",
                        color: "white",
                        mb: 2,
                        transition: "color 0.3s ease-in-out",
                      }}
                    />
                    <CardContent>
                      <Typography variant="h5" gutterBottom>
                        Find a Ride
                      </Typography>
                      <Typography>
                        Search and book rides that match your travel plans and
                        preferences.
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
              </motion.div>
            </Grid>

            <Grid item xs={12} md={4}>
              <motion.div
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                viewport={{ amount: 0.2 }}
              >
                <Box
                  sx={{
                    "&:hover .hover-icon": {
                      color: "white",
                    },
                    "&:hover .hover-card": {
                      boxShadow: "0px 8px 16px rgba(0,0,0,0.2)",
                      transform: "scale(1.05) translateY(-50px)",
                      background:
                        "radial-gradient(#f3bedc, #e9bde3, #dcbee8, #cebeed, #bebfef, #b2c4f3, #a6c9f4, #9ccdf4, #98d6f4, #9adff2, #a1e6ee, #adede9)",
                      color: "white",
                    },
                  }}
                >
                  <Card
                    className="hover-card"
                    sx={{
                      height: "100%",
                      textAlign: "center",
                      p: 3,
                      transition:
                        "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                      background:
                        "linear-gradient(to left, #f3bedc, #e9bde3, #dcbee8, #cebeed, #bebfef, #b2c4f3, #a6c9f4, #9ccdf4, #98d6f4, #9adff2, #a1e6ee, #adede9)",
                      color: "white",
                    }}
                  >
                    <SecurityIcon
                      className="hover-icon"
                      sx={{
                        fontSize: 60,
                        // color: "primary.main",
                        color: "white",
                        mb: 2,
                        transition: "color 0.3s ease-in-out",
                      }}
                    />
                    <CardContent>
                      <Typography variant="h5" gutterBottom>
                        Safe Travel
                      </Typography>
                      <Typography>
                        Travel with verified users and enjoy a secure carpooling
                        experience.
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Specialization Section */}
      <Box sx={{ py: 8, backgroundColor: "background.paper" }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            textAlign="center"
            sx={{
              fontWeight: "bold",
              background:
                "linear-gradient(to right, #f3bedc, #e9bde3, #dcbee8, #cebeed, #bebfef, #b2c4f3, #a6c9f4, #9ccdf4, #98d6f4, #9adff2, #a1e6ee, #adede9)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              textFillColor: "transparent",
            }}
            gutterBottom
          >
            Why Choose DoryCar?
          </Typography>
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ amount: 0.2 }}
          >
            <Grid container spacing={4} alignItems="center" sx={{ mt: 4 }}>
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 4 }}>
                  <SavingsIcon
                    sx={{ fontSize: 40, color: "primary.main", mb: 1 }}
                  />
                  <Typography variant="h5" gutterBottom>
                    Cost-Effective
                  </Typography>
                  <Typography>
                    Share travel expenses and save money on your journeys.
                  </Typography>
                </Box>
                <Box sx={{ mb: 4 }}>
                  <SecurityIcon
                    sx={{ fontSize: 40, color: "primary.main", mb: 1 }}
                  />
                  <Typography variant="h5" gutterBottom>
                    Verified Users
                  </Typography>
                  <Typography>
                    Travel with confidence knowing all users are verified.
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <motion.div
                  initial={{ opacity: 0, x: 100 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  viewport={{ amount: 0.2 }}
                >
                  <Box
                    component="img"
                    src="/img2.jpg"
                    alt="dorycar_image"
                    sx={{
                      width: "100%",
                      // borderRadius: 2,
                      // boxShadow: 3,
                      transition: "transform 0.3s ease-in-out",
                      "&:hover": {
                        transform: "scale(1.2)",
                      },
                    }}
                  />
                </motion.div>
              </Grid>
            </Grid>
          </motion.div>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box
        sx={{
          py: 8,
          backgroundColor: "background.default",
          background:
            "linear-gradient(to right, #f3bedc, #e9bde3, #dcbee8, #cebeed, #bebfef, #b2c4f3, #a6c9f4, #9ccdf4, #98d6f4, #9adff2, #a1e6ee, #adede9)",
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            textAlign="center"
            gutterBottom
            sx={{
              fontWeight: "bold",
              mb: 6,
              transition: "margin-bottom 0.3s ease-in-out",
              color: "white",
            }}
          >
            What Our Users Say
          </Typography>
          <Grid container spacing={4} sx={{ mt: 4 }}>
            {[
              {
                name: "M. Afjal",
                text: "DoryCar has made my daily commute so much more affordable and enjoyable. I have met great people along the way!",
              },
              {
                name: "Ashmita Thakur",
                text: "As a car owner, I love being able to share my journey and reduce costs while helping others travel.",
              },
              {
                name: "Vimal Singh",
                text: "The platform is so easy to use, and the verification system makes me feel safe when traveling with others.",
              },
            ].map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 100 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  viewport={{ amount: 0.2 }}
                >
                  <Card
                    sx={{
                      height: "100%",
                      p: 3,
                      borderRadius: 5,
                      transition:
                        "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                      "&:hover": {
                        boxShadow: "0px 8px 16px rgba(0,0,0,0.2)",
                        transform: "scale(1.05) translateY(-50px)",
                      },
                    }}
                  >
                    <CardContent>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 2 }}
                      >
                        <Avatar sx={{ bgcolor: "primary.main", mr: 15 }}>
                          {testimonial.name.charAt(0)}
                        </Avatar>
                        <Box sx={{ display: "flex" }}>
                          <StarIcon sx={{ color: "gold" }} />
                          <StarIcon sx={{ color: "gold" }} />
                          <StarIcon sx={{ color: "gold" }} />
                          <StarIcon sx={{ color: "gold" }} />
                          <StarBorderIcon sx={{ color: "gold" }} />
                        </Box>
                      </Box>

                      <img
                        src="/testimonial.png"
                        alt="testimonial"
                        style={{
                          width: "30px",
                          height: "30px",
                          marginBottom: "16px",
                          color: "blue",
                        }}
                      />

                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{ color: "black", fontWeight: "bold" }}
                      >
                        {testimonial.name}
                      </Typography>
                      <Typography>"{testimonial.text}"</Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ py: 8, backgroundColor: "background.paper" }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                About DoryCar
              </Typography>
              <Typography>
                Your trusted carpooling platform connecting drivers and
                passengers for safe and affordable travel.
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ fontWeight: "bold", mb: 0, textAlign: "left" }}
                >
                  Quick Links
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <Button color="inherit" onClick={() => navigate("/about")}>
                    About Us
                  </Button>
                  <Button color="inherit" onClick={() => navigate("/contact")}>
                    Contact
                  </Button>
                  <Button color="inherit" onClick={() => navigate("/privacy")}>
                    Privacy Policy
                  </Button>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                Connect With Us
              </Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                <IconButton
                  color="primary"
                  onClick={() =>
                    window.open("https://www.facebook.com/", "_blank")
                  }
                >
                  <FacebookIcon />
                </IconButton>
                <IconButton
                  color="primary"
                  onClick={() => window.open("https://x.com/login")}
                >
                  <TwitterIcon />
                </IconButton>
                <IconButton
                  color="primary"
                  onClick={() => window.open("https://www.instagram.com/")}
                >
                  <InstagramIcon />
                </IconButton>
                <IconButton
                  color="primary"
                  onClick={() => window.open("https://www.linkedin.com/")}
                >
                  <LinkedInIcon />
                </IconButton>
              </Box>
            </Grid>
          </Grid>
          <Box sx={{ mt: 4, pt: 4, borderTop: 1, borderColor: "divider" }}>
            <Typography textAlign="center" color="text.secondary">
              © {new Date().getFullYear()} DoryCar. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
