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
  const [move, setMove] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setMove((prev) => !prev);
    }, 5000); // Move every 5 seconds

    return () => clearInterval(interval);
  }, []);

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
                        fontWeight: "none",
                        color: "white",
                        whiteSpace: "normal",
                        wordWrap: "break-word",
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                      }}
                    >
                      <span>
                        <Typewriter
                          words={["Connect Ride & Share Ride.."]}
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
                  label="Passengers"
                  type="number"
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
                  onClick={() => {
                    setShowResults(true);
                    setSearchResults([
                      {
                        id: 1,
                        from: "New York",
                        to: "Boston",
                        date: "2023-08-15",
                        price: 45,
                        seats: 3,
                      },
                      {
                        id: 2,
                        from: "New York",
                        to: "Boston",
                        date: "2023-08-15",
                        price: 50,
                        seats: 2,
                      },
                    ]);
                  }}
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
            <Box
              sx={{
                p: 3,
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                borderRadius: 2,
                backdropFilter: "blur(8px)",
                animation: "fadeIn 0.5s ease-in-out",
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                sx={{ color: "text.primary" }}
              >
                Available Rides
              </Typography>
              <Grid container spacing={2}>
                {searchResults.map((ride) => (
                  <Grid item xs={12} key={ride.id}>
                    <Card
                      sx={{
                        display: "flex",
                        p: 2,
                        transition: "transform 0.2s",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: 4,
                        },
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          flexGrow: 1,
                        }}
                      >
                        <CardContent sx={{ flex: "1 0 auto", pb: 1 }}>
                          <Typography variant="h6" component="div">
                            {ride.from} → {ride.to}
                          </Typography>
                          <Typography
                            variant="subtitle1"
                            color="text.secondary"
                          >
                            {new Date(ride.date).toLocaleDateString()}
                          </Typography>
                          <Typography variant="body2">
                            ${ride.price} per seat • {ride.seats} seats
                            available
                          </Typography>
                        </CardContent>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            pl: 2,
                            pb: 2,
                          }}
                        >
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                          >
                            Book Now
                          </Button>
                        </Box>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
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
                name: "John Doe",
                text: "DoryCar has made my daily commute so much more affordable and enjoyable. I have met great people along the way!",
              },
              {
                name: "Jane Smith",
                text: "As a car owner, I love being able to share my journey and reduce costs while helping others travel.",
              },
              {
                name: "Mike Johnson",
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
                <IconButton color="primary">
                  <FacebookIcon />
                </IconButton>
                <IconButton color="primary">
                  <TwitterIcon />
                </IconButton>
                <IconButton color="primary">
                  <InstagramIcon />
                </IconButton>
                <IconButton color="primary">
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
