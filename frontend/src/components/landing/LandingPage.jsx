import { useState } from 'react';
import { Box, Typography, Button, Container, Grid, TextField, Paper, IconButton, Card, CardContent, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { DatePicker } from '@mui/x-date-pickers';
import SearchIcon from '@mui/icons-material/Search';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import SecurityIcon from '@mui/icons-material/Security';
import SavingsIcon from '@mui/icons-material/Savings';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import PersonIcon from '@mui/icons-material/Person';

const LandingPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    from: '',
    to: '',
    date: null,
    passengers: 1
  });
  const [showResults, setShowResults] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          backgroundImage: 'url(/carpooling.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '100vh',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
          },
        }}
      >
        <Container maxWidth="xl" sx={{ position: 'relative', alignItems:'center', height: '100%' }}>
          <Grid container spacing={4} alignItems="center" justifyContent="center" sx={{ height: '100%' }}>
            <Grid item xs={12} md={8}>
              <Typography variant="h1" component="h1" gutterBottom sx={{textAlign:'center' ,color: 'white', mb: 4 }}>
                Ride with DoryCar
              </Typography>
              <Typography variant="h5" sx={{ textAlign:'center' , color: 'white', mb: 6 }}>
                Connect, share rides, and make your journey more affordable and sustainable.
              </Typography>
              <Paper sx={{ p: 3, borderRadius: 2, width: '100%', maxWidth: '1200px', mx: 'auto', backdropFilter: 'none', backgroundColor: 'white', boxShadow: 3 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={3}>
                    <TextField 
                      fullWidth 
                      label="From" 
                      variant="outlined"
                      value={searchParams.from}
                      onChange={(e) => setSearchParams({ ...searchParams, from: e.target.value })}
                      sx={{ backgroundColor: 'white' }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField 
                      fullWidth 
                      label="To" 
                      variant="outlined"
                      value={searchParams.to}
                      onChange={(e) => setSearchParams({ ...searchParams, to: e.target.value })}
                      sx={{ backgroundColor: 'white' }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <DatePicker
                      label="Date"
                      value={searchParams.date}
                      onChange={(newDate) => setSearchParams({ ...searchParams, date: newDate })}
                      sx={{ width: '100%', backgroundColor: 'white' }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <TextField
                      fullWidth
                      label="Passengers"
                      type="number"
                      InputProps={{ 
                        inputProps: { min: 1 },
                        startAdornment: <PersonIcon sx={{ color: 'action.active', mr: 1 }} />
                      }}
                      value={searchParams.passengers}
                      onChange={(e) => setSearchParams({ ...searchParams, passengers: parseInt(e.target.value) || 1 })}
                      sx={{ backgroundColor: 'white' }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      sx={{ height: '56px', minWidth: '50px', fontWeight: 'bold' }}
                      onClick={() => {
                        setShowResults(true);
                        // Mock search results - replace with actual API call
                        setSearchResults([
                          { id: 1, from: 'New York', to: 'Boston', date: '2023-08-15', price: 45, seats: 3 },
                          { id: 2, from: 'New York', to: 'Boston', date: '2023-08-15', price: 50, seats: 2 },
                        ]);
                      }}
                    >
                      <SearchIcon />
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
              {showResults && (
                <Box sx={{
                  mt: 4,
                  p: 3,
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: 2,
                  backdropFilter: 'blur(8px)',
                  animation: 'fadeIn 0.5s ease-in-out',
                  maxWidth: '800px',
                  mx: 'auto'
                }}>
                  <Typography variant="h6" gutterBottom sx={{ color: 'text.primary' }}>
                    Available Rides
                  </Typography>
                  <Grid container spacing={2}>
                    {searchResults.map((ride) => (
                      <Grid item xs={12} key={ride.id}>
                        <Card sx={{
                          display: 'flex',
                          p: 2,
                          transition: 'transform 0.2s',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: 4
                          }
                        }}>
                          <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                            <CardContent sx={{ flex: '1 0 auto', pb: 1 }}>
                              <Typography variant="h6" component="div">
                                {ride.from} → {ride.to}
                              </Typography>
                              <Typography variant="subtitle1" color="text.secondary">
                                {new Date(ride.date).toLocaleDateString()}
                              </Typography>
                              <Typography variant="body2">
                                ${ride.price} per seat • {ride.seats} seats available
                              </Typography>
                            </CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', pl: 2, pb: 2 }}>
                              <Button variant="contained" color="primary" size="small">
                                Book Now
                              </Button>
                            </Box>
                          </Box>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Services Section */}
      <Box sx={{ py: 8, backgroundColor: 'background.default' }}>
        <Container maxWidth="lg">
          <Typography variant="h2" textAlign="center" gutterBottom>
            Our Services
          </Typography>
          <Grid container spacing={4} sx={{ mt: 4 }}>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', textAlign: 'center', p: 3 }}>
                <DirectionsCarIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <CardContent>
                  <Typography variant="h5" gutterBottom>Publish a Ride</Typography>
                  <Typography>Share your journey and reduce travel costs by offering rides to fellow travelers.</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', textAlign: 'center', p: 3 }}>
                <SearchIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <CardContent>
                  <Typography variant="h5" gutterBottom>Find a Ride</Typography>
                  <Typography>Search and book rides that match your travel plans and preferences.</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', textAlign: 'center', p: 3 }}>
                <SecurityIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <CardContent>
                  <Typography variant="h5" gutterBottom>Safe Travel</Typography>
                  <Typography>Travel with verified users and enjoy a secure carpooling experience.</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Specialization Section */}
      <Box sx={{ py: 8, backgroundColor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Typography variant="h2" textAlign="center" gutterBottom>
            Why Choose DoryCar?
          </Typography>
          <Grid container spacing={4} alignItems="center" sx={{ mt: 4 }}>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 4 }}>
                <SavingsIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography variant="h5" gutterBottom>Cost-Effective</Typography>
                <Typography>Share travel expenses and save money on your journeys.</Typography>
              </Box>
              <Box sx={{ mb: 4 }}>
                <SecurityIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography variant="h5" gutterBottom>Verified Users</Typography>
                <Typography>Travel with confidence knowing all users are verified.</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="/dorycar3.jpg"
                alt="dorycar_image"
                sx={{
                  width: '100%',
                  borderRadius: 2,
                  boxShadow: 3
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box sx={{ py: 8, backgroundColor: 'background.default' }}>
        <Container maxWidth="lg">
          <Typography variant="h2" textAlign="center" gutterBottom>
            What Our Users Say
          </Typography>
          <Grid container spacing={4} sx={{ mt: 4 }}>
            {[
              {
                name: 'John Doe',
                text: 'DoryCar has made my daily commute so much more affordable and enjoyable. I have met great people along the way!',
              },
              {
                name: 'Jane Smith',
                text: 'As a car owner, I love being able to share my journey and reduce costs while helping others travel.',
              },
              {
                name: 'Mike Johnson',
                text: 'The platform is so easy to use, and the verification system makes me feel safe when traveling with others.',
              },
            ].map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card sx={{ height: '100%', p: 3 }}>
                  <CardContent>
                    <Avatar sx={{ mb: 2, bgcolor: 'primary.main' }}>
                      {testimonial.name.charAt(0)}
                    </Avatar>
                    <Typography variant="h6" gutterBottom>{testimonial.name}</Typography>
                    <Typography>"{testimonial.text}"</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ py: 8, backgroundColor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>About DoryCar</Typography>
              <Typography>Your trusted carpooling platform connecting drivers and passengers for safe and affordable travel.</Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>Quick Links</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button color="inherit" onClick={() => navigate('/about')}>About Us</Button>
                <Button color="inherit" onClick={() => navigate('/contact')}>Contact</Button>
                <Button color="inherit" onClick={() => navigate('/privacy')}>Privacy Policy</Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>Connect With Us</Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <IconButton color="primary"><FacebookIcon /></IconButton>
                <IconButton color="primary"><TwitterIcon /></IconButton>
                <IconButton color="primary"><InstagramIcon /></IconButton>
                <IconButton color="primary"><LinkedInIcon /></IconButton>
              </Box>
            </Grid>
          </Grid>
          <Box sx={{ mt: 4, pt: 4, borderTop: 1, borderColor: 'divider' }}>
            <Typography textAlign="center" color="text.secondary">
              © {new Date().getFullYear()} DoryCar. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Logo and Login/Register Buttons */}
      <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 4, py: 2, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0,0,0,0.5)', mr: 4 }}>
          DoryCar
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/register')}
          >
            Get Started
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate('/login')}
            sx={{ backgroundColor: 'white' }}
          >
            Login
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default LandingPage;