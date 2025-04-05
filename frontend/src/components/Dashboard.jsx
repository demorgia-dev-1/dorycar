import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  CardActions
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { rideService } from '../services/api';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [userRides, setUserRides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserRides();
  }, []);

  const fetchUserRides = async () => {
    try {
      const rides = await rideService.getRides();
      // setUserRides(rides.filter(ride => 
      //   ride.creator === user._id || ride.acceptor === user._id
      // ));

      setUserRides(
        rides.filter(
          (ride) =>
            ride.creator?._id === user._id || ride.creator === user._id || 
            ride.acceptor?._id === user._id || ride.acceptor === user._id
        )
      );
      
    } catch (error) {
      console.error('Error fetching rides:', error);
      toast.error('Failed to fetch rides');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (rideId, action, userId) => {
    try {
      switch (action) {
        case 'accept':
          // await rideService.acceptInterest(rideId, user._id);

          await rideService.acceptRide(rideId, userId);
          break;
        case 'cancel':
          await rideService.cancelRide(rideId);
          break;
        case 'complete':
          await rideService.completeRide(rideId);
          break;
        default:
          return;
      }
      toast.success(`Ride ${action}ed successfully`);
      fetchUserRides();
    } catch (error) {
      console.error(`Error ${action}ing ride:`, error);
      toast.error(`Failed to ${action} ride`);
    }
  };
  const RideCard = ({ ride }) => {
    const isCreator = ride.creator?._id === user._id || ride.creator === user._id;
    // const isAcceptor = ride.acceptor?._id === user._id || ride.acceptor === user._id;  

    return (
      <Card sx={{ mb: 2, marginTop: 15 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {ride.origin} → {ride.destination}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Date: {new Date(ride.date).toLocaleDateString()}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Status: {ride.status}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Role: {isCreator ? 'Creator' : 'Acceptor'}
          </Typography>
        </CardContent>
    
        {/* ✅ Show Interested Users for Creator */}
        {isCreator && ride.interestedUsers?.length > 0 && (
          <Box mt={1} ml={2}>
            <Typography variant="subtitle2" gutterBottom>
              Interested Users:
            </Typography>
            {ride.interestedUsers.map((interest, index) => (
              <Box key={index} sx={{ mb: 1 }}>
                <Typography variant="body2">
                  {interest.user?.name || 'Unnamed User'} – Status: {interest.status}
                </Typography>
    
                {interest.status === 'interested' && (
                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    sx={{ mt: 0.5 }}
                    onClick={() => handleStatusChange(ride._id, 'accept', interest.user._id)}
                  >
                    Accept This User
                  </Button>
                )}
              </Box>
            ))}
          </Box>
        )}
    
        <CardActions>
          {/* ✅ Show Complete/Cancel for accepted rides */}
          {ride.status === 'accepted' && (
            <Button
              size="small"
              color="success"
              onClick={() => handleStatusChange(ride._id, 'complete')}
            >
              Complete Ride
            </Button>
          )}
          {ride.status !== 'completed' && (
            <Button
              size="small"
              color="error"
              onClick={() => handleStatusChange(ride._id, 'cancel')}
            >
              Cancel Ride
            </Button>
          )}
        </CardActions>
      </Card>
    );
    

//     return (
//       <Card sx={{ mb:2, marginTop:15}}>
//         <CardContent>
//           <Typography variant="h6" gutterBottom>
//             {ride.origin} → {ride.destination}
//           </Typography>
//           <Typography variant="body2" color="text.secondary">
//             Date: {new Date(ride.date).toLocaleDateString()}
//           </Typography>
//           <Typography variant="body2" color="text.secondary">
//             Status: {ride.status}
//           </Typography>
//           <Typography variant="body2" color="text.secondary">
//             Role: {isCreator ? 'Creator' : 'Acceptor'}
//           </Typography>
//         </CardContent>
//         <CardActions>
//         {/* If current user is the creator, show accept buttons for interested users */}
// {isCreator && ride.interestedUsers?.length > 0 && (
//   <Box mt={2}>
//     <Typography variant="body2" fontWeight="bold">
//       Interested Users:
//     </Typography>
//     {ride.interestedUsers.map((interest, index) => (
//       <Box key={index} sx={{ ml: 2, mb: 1 }}>
//         <Typography variant="body2">
//           {interest.user?.name || 'Unnamed User'} - Status: {interest.status}
//         </Typography>

//         {interest.status === 'interested' && (
//           <Button
//             size="small"
//             color="primary"
//             onClick={() =>
//               handleStatusChange(ride._id, 'accept', interest.user._id)
//             }
//           >
//             Accept This User
//           </Button>
//         )}
//       </Box>
//     ))}
//   </Box>
// )}

//           {/* {ride.status === 'pending' && !isCreator && (
//             <Button
//               size="small"
//               color="primary"
//               onClick={() => handleStatusChange(ride._id, 'accept')}
//             >
//               Accept Ride
//             </Button>
//           )} */}
//           {ride.status === 'accepted' && (
//             <Button
//               size="small"
//               color="success"
//               onClick={() => handleStatusChange(ride._id, 'complete')}
//             >
//               Complete Ride
//             </Button>
//           )}
//           {ride.status !== 'completed' && (
//             <Button
//               size="small"
//               color="error"
//               onClick={() => handleStatusChange(ride._id, 'cancel')}
//             >
//               Cancel Ride
//             </Button>
//           )}
//         </CardActions>
//       </Card>
//     );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 14, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h4" component="h1">
                Welcome, {user?.name}!
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/rides/create')}
              >
                Create New Ride
              </Button>
            </Box>

            <Typography variant="h5" gutterBottom>
              Your Rides
            </Typography>
            
            {loading ? (
              <Typography>Loading rides...</Typography>
            ) : userRides.length > 0 ? (
              userRides.map((ride) => (
                <RideCard key={ride._id} ride={ride} />
              ))
            ) : (
              <Typography color="text.secondary">
                No rides found. Create a new ride or accept an available one!
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;