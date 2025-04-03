import { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Box,
  Chip
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { rideService } from '../../services/api';
import { toast } from 'react-toastify';

const RideList = () => {
  const { user } = useAuth();
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRides();
  }, []);

  const fetchRides = async () => {
    try {
      const response = await rideService.getRides();
      setRides(response);
    } catch (error) {
      console.error('Error fetching rides:', error);
      toast.error('Failed to fetch rides');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRide = async (rideId) => {
    try {
      await rideService.acceptRide(rideId);
      toast.success('Ride accepted successfully!');
      fetchRides();
    } catch (error) {
      console.error('Error accepting ride:', error);
      toast.error(error.response?.data?.message || 'Failed to accept ride');
    }
  };

  const RideCard = ({ ride }) => {
    const isCreator = ride.creator === user._id;
    const isAcceptor = ride.acceptor === user._id;
    const canAccept = !isCreator && !isAcceptor && ride.status === 'pending';

    return (
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" gutterBottom>
              {ride.origin} → {ride.destination}
            </Typography>
            <Chip
              label={ride.status}
              color={
                ride.status === 'completed'
                  ? 'success'
                  : ride.status === 'pending'
                  ? 'warning'
                  : 'primary'
              }
              size="small"
            />
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Date: {new Date(ride.date).toLocaleDateString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Time: {new Date(ride.date).toLocaleTimeString()}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Available Seats: {ride.seats}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Price per Seat: ${ride.price}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
        <CardActions>
          {canAccept && (
            <Button
              size="small"
              color="primary"
              onClick={() => handleAcceptRide(ride._id)}
            >
              Accept Ride
            </Button>
          )}
          {(isCreator || isAcceptor) && (
            <Chip
              label={isCreator ? 'You created this ride' : 'You accepted this ride'}
              size="small"
              variant="outlined"
            />
          )}
        </CardActions>
      </Card>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Available Rides
        </Typography>
        {loading ? (
          <Typography>Loading rides...</Typography>
        ) : rides.length > 0 ? (
          rides.map((ride) => <RideCard key={ride._id} ride={ride} />)
        ) : (
          <Typography color="text.secondary">
            No rides available at the moment.
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default RideList;