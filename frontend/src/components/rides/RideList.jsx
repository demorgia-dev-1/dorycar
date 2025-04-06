// import { useState, useEffect } from 'react';
// import {
//   Container,
//   Paper,
//   Typography,
//   Card,
//   CardContent,
//   CardActions,
//   Button,
//   Grid,
//   Box,
//   Chip
// } from '@mui/material';
// import { useAuth } from '../../context/AuthContext';
// import { rideService } from '../../services/api';
// import { toast } from 'react-toastify';
// import socket from '../../services/socket';

// const RideList = () => {
//   const { user } = useAuth();
//   const [rides, setRides] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // useEffect(() => {
//   //   fetchRides();
//   // }, []);

//   useEffect(() => {
//     fetchRides();
  
//     // Connect to socket server
//     socket.connect();
  
//     // Listen for ride updates
//     socket.on('ride-updated', (updatedRide) => {
//       setRides((prevRides) => {
//         const exists = prevRides.some((ride) => ride._id === updatedRide._id);
//         return exists
//           ? prevRides.map((ride) =>
//               ride._id === updatedRide._id ? updatedRide : ride
//             )
//           : [updatedRide, ...prevRides];
//       });
//     });
  
//     // Clean up on unmount
//     return () => {
//       socket.off('ride-updated');
//       socket.disconnect();
//     };
//   }, []);
  

//   const fetchRides = async () => {
//     try {
//       const response = await rideService.getRides();
//       setRides(response);
//     } catch (error) {
//       console.error('Error fetching rides:', error);
//       toast.error('Failed to fetch rides');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAcceptRide = async (rideId) => {
//     try {
//       // await rideService.acceptRide(rideId);
//       await rideService.acceptRide(rideId, user._id);
//       toast.success('Ride accepted successfully!');
//       fetchRides();
//     } catch (error) {
//       console.error('Error accepting ride:', error);
//       toast.error(error.response?.data?.message || 'Failed to accept ride');
//     }
//   };

//   const RideCard = ({ ride }) => {
//   //   const isCreator = ride.creator === user._id;
//   // const isAcceptor = ride.acceptor === user._id;
//   const isCreator = ride.creator?._id === user._id;
// const isAcceptor = ride.acceptor?._id === user._id;
// const alreadyInterested = ride.interestedUsers?.some(u => u.user?._id === user._id);

//   // const alreadyInterested = ride.interestedUsers?.some(u => u.user === user._id);
//   const canAccept = !isCreator && !isAcceptor && !alreadyInterested && ride.status === 'pending';


//     const handleExpressInterest = async (rideId) => {
//       try {
//         await rideService.expressInterest(rideId);
//         toast.success("Interest expressed!");
//         fetchRides();
//       } catch (error) {
//         console.error('Error expressing interest:', error);
//         toast.error(error.response?.data?.message || "Failed to express interest");
//       }
//     };

//     return (
//       <Card sx={{ mb: 2 }}>
//         <CardContent>
//           <Box display="flex" justifyContent="space-between" alignItems="center">
//             <Typography variant="h6" gutterBottom>
//               {ride.origin} → {ride.destination}
//             </Typography>
//             <Chip
//               label={ride.status}
//               color={
//                 ride.status === 'completed'
//                   ? 'success'
//                   : ride.status === 'pending'
//                   ? 'warning'
//                   : 'primary'
//               }
//               size="small"
//             />
//           </Box>
//           <Grid container spacing={2}>
//             <Grid item xs={12} sm={6}>
//               <Typography variant="body2" color="text.secondary">
//                 Date: {new Date(ride.date).toLocaleDateString()}
//               </Typography>
//               <Typography variant="body2" color="text.secondary">
//                 Time: {new Date(ride.date).toLocaleTimeString()}
//               </Typography>
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <Typography variant="body2" color="text.secondary">
//                 Available Seats: {ride.seats}
//               </Typography>
//               <Typography variant="body2" color="text.secondary">
//                 Price per Seat: ${ride.price}
//               </Typography>
//             </Grid>
//           </Grid>
//         </CardContent>
//         <CardActions>
//           {canAccept && (
//             <Button
//               size="small"
//               color="primary"
//               onClick={() => handleAcceptRide(ride._id)}
//             >
//               Accept Ride
//             </Button>
//           )}
//           {(isCreator || isAcceptor || alreadyInterested) && (
//             <Chip
//               label={isCreator ? 'You created this ride' : 'You accepted this ride'}
//               size="small"
//               variant="outlined"
//             />
            
//           )}
          
//         </CardActions>
//         <CardActions>
//         {!isCreator && !isAcceptor && !alreadyInterested && (
//           <Button onClick={() => handleExpressInterest(ride._id)}>Express Interest</Button>
          
//         )}
//       </CardActions>
//        {ride.status === 'accepted' && (
//           <Typography variant='body2' color={'text.secondary'}>
//             accepted by {ride.acceptor.name}
//           </Typography>
//        )}
//         {ride.status === 'completed' && (
//           <Typography variant='body2' color={'text.secondary'}>
//             completed on {new Date(ride.completedAt).toLocaleDateString()}
//           </Typography>

//         )}
//       </Card>
//     );
//   };

//   return (
//     <Container maxWidth="lg" sx={{ mt: 15, mb: 4 }}>
//       <Paper sx={{ p: 3 }}>
//         <Typography variant="h4" component="h1" gutterBottom>
//           Available Rides
//         </Typography>
//         {loading ? (
//           <Typography>Loading rides...</Typography>
//         ) : rides.length > 0 ? (
//           rides.map((ride) => <RideCard key={ride._id} ride={ride} />)
//         ) : (
//           <Typography color="text.secondary">
//             No rides available at the moment.
//           </Typography>
//         )}
//       </Paper>
//     </Container>
    
//   );
// };

// export default RideList;


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
import socket from '../../services/socket';

const RideList = () => {
  const { user } = useAuth();
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRides();

    // Connect to socket server
    socket.connect();

    // Listen for ride updates
    socket.on('ride-updated', (updatedRide) => {
      setRides((prevRides) => {
        const exists = prevRides.some((ride) => ride._id === updatedRide._id);
        return exists
          ? prevRides.map((ride) =>
              ride._id === updatedRide._id ? updatedRide : ride
            )
          : [updatedRide, ...prevRides];
      });
    });

    return () => {
      socket.off('ride-updated');
      socket.disconnect();
    };
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
      await rideService.acceptRide(rideId, user._id);
      toast.success('Ride accepted successfully!');
      fetchRides();
    } catch (error) {
      console.error('Error accepting ride:', error);
      toast.error(error.response?.data?.message || 'Failed to accept ride');
    }
  };

  const RideCard = ({ ride }) => {
    if (!ride || !ride._id) return null;

    const isCreator = ride.creator?._id === user._id;
    const isAcceptor = ride.acceptor?._id === user._id;
    const alreadyInterested = ride.interestedUsers?.some(
      (u) => u.user?._id === user._id
    );

    const canAccept =
      !isCreator && !isAcceptor && !alreadyInterested && ride.status === 'pending';

    const handleExpressInterest = async (rideId) => {
      if (!rideId) {
        console.error("Invalid rideId passed to expressInterest");
        return;
      }

      try {
        await rideService.expressInterest(rideId);
        toast.success("Interest expressed!");
        fetchRides();
      } catch (error) {
        console.error('Error expressing interest:', error);
        toast.error(error.response?.data?.message || "Failed to express interest");
      }
    };

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
          {(isCreator || isAcceptor || alreadyInterested) && (
            <Chip
              label={
                isCreator
                  ? 'You created this ride'
                  : isAcceptor
                  ? 'You accepted this ride'
                  : 'Interest Expressed'
              }
              size="small"
              variant="outlined"
            />
          )}
        </CardActions>
        <CardActions>
          {!isCreator && !isAcceptor && !alreadyInterested && (
            <Button onClick={() => handleExpressInterest(ride._id)}>
              Express Interest
            </Button>
          )}
        </CardActions>
        {ride.status === 'accepted' && ride.acceptor?.name && (
          <Typography variant="body2" color="text.secondary" sx={{ px: 2 }}>
            Accepted by {ride.acceptor.name}
          </Typography>
        )}
        {ride.status === 'completed' && ride.completedAt && (
          <Typography variant="body2" color="text.secondary" sx={{ px: 2 }}>
            Completed on {new Date(ride.completedAt).toLocaleDateString()}
          </Typography>
        )}
      </Card>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 15, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Available Rides
        </Typography>
        {loading ? (
          <Typography>Loading rides...</Typography>
        ) : rides.length > 0 ? (
          rides.map((ride) =>
            ride._id ? <RideCard key={ride._id} ride={ride} /> : null
          )
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
