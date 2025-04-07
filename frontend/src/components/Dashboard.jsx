import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Rating,
  TextField,
  Chip,
} from "@mui/material";

import { useAuth } from "../context/AuthContext";
import { rideService } from "../services/api";
import { toast } from "react-toastify";
import socket from "../services/socket";
import { HourglassBottomIcon } from "@mui/icons-material/HourglassBottom";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [userRides, setUserRides] = useState([]);
  const [loading, setLoading] = useState(true);

  const cancellationReasons = [
    "Change of plans",
    "Vehicle issue",
    "Passenger did not respond",
    "Emergency",
    "Other",
  ];

  const [openCancelModal, setOpenCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [rideToCancel, setRideToCancel] = useState(null);
  const [customReason, setCustomReason] = useState("");
  const [highlightedRideId, setHighlightedRideId] = useState(null);
  const [openReviewModal, setOpenReviewModal] = useState(false);
  const [reviewRide, setReviewRide] = useState(null);
  const [ratingValue, setRatingValue] = useState(0);
  const [comment, setComment] = useState("");

  useEffect(() => {
    fetchUserRides(); // initial fetch
    const handleRideUpdated = (updatedRide) => {
      const isUserInvolved =
        updatedRide.creator?._id === user._id ||
        updatedRide.creator === user._id ||
        updatedRide.acceptor?._id === user._id ||
        updatedRide.acceptor === user._id;

      if (!isUserInvolved) return;

      setUserRides((prevRides) => {
        const rideIndex = prevRides.findIndex((r) => r._id === updatedRide._id);

        if (rideIndex !== -1) {
          // Replace the updated ride
          const updated = [...prevRides];
          updated[rideIndex] = updatedRide;
          return updated;
        } else {
          // New ride added (e.g. user just accepted)
          return [updatedRide, ...prevRides];
        }
      });
      setHighlightedRideId(updatedRide._id);

      setTimeout(() => setHighlightedRideId(null), 3000);
    };

    socket.on("ride-updated", handleRideUpdated);
    return () => socket.off("ride-updated", handleRideUpdated);
  }, [user]);

  const fetchUserRides = async () => {
    try {
      // const rides = await rideService.getRides();
      // setUserRides(rides.filter(ride =>
      //   ride.creator === user._id || ride.acceptor === user._id
      // ));

      const rides = await rideService.getRides();
      const filtered = rides.filter(
        (ride) =>
          ride.creator?._id === user._id ||
          ride.creator === user._id ||
          ride.acceptor?._id === user._id ||
          ride.acceptor === user._id ||
          ride.interestedUsers.some(
            (i) => i.user?._id === user._id || i.user === user._id
          )
      );

      console.log("Ride object:", rides);

      setUserRides(filtered);

      // setUserRides(
      //   rides.filter(
      //     (ride) =>
      //       ride.creator?._id === user._id ||
      //       ride.creator === user._id ||
      //       ride.acceptor?._id === user._id ||
      //       ride.acceptor === user._id
      //   )
      // );
    } catch (error) {
      console.error("Error fetching rides:", error);
      toast.error("Failed to fetch rides");
    } finally {
      setLoading(false);
    }
  };

  const openCancellationDialog = (rideId) => {
    setRideToCancel(rideId);
    setOpenCancelModal(true);
  };

  const confirmCancel = async () => {
    if (!cancelReason) {
      toast.error("Please select a reason");
      return;
    }
    try {
      const reasonToSend =
        cancelReason === "Other" ? customReason.trim() : cancelReason;
      await rideService.cancelRide(rideToCancel, reasonToSend);
      toast.success("Ride cancelled successfully");
      setOpenCancelModal(false);
      setCancelReason("");
      setRideToCancel(null);
      fetchUserRides();
    } catch (error) {
      toast.error("Failed to cancel ride");
    }
  };

  const handleStatusChange = async (rideId, action, userId) => {
    try {
      let updatedRide;
      switch (action) {
        // case "accept":
        //   // await rideService.acceptInterest(rideId, user._id);

        //   await rideService.acceptRide(rideId, userId);
        //   break;
        case "accept":
  try {
    await rideService.acceptRide(rideId, userId);
    toast.success("Ride accepted successfully");
  } catch (error) {
    console.error("Accept ride failed:", error);
    toast.error("Failed to accept user");
  }
  break;

        case "cancel":
          // await rideService.cancelRide(rideId);
          const reason = prompt("Please provide a reason for cancellation:");
          await rideService.cancelRide(rideId, reason);

          break;
        // case "complete":
        //   await rideService.completeRide(rideId);
        //   break;
        case "complete":
        try {
          updatedRide = await rideService.completeRide(rideId);
          toast.success("✅ Ride completed successfully");
        } catch (error) {
          console.error("❌ Failed to complete ride:", error);
          toast.error(error?.response?.data?.message || "Failed to complete ride");
          return; // Stop further execution
        }

        const isAcceptor =
          updatedRide.acceptor === user._id ||
          updatedRide.acceptor?._id === user._id;

        if (isAcceptor) {
          setReviewRide(updatedRide);
          setOpenReviewModal(true);
        }
        break;

        case "start":
          await rideService.startRide(rideId);
          break;

        default:
          return;
      }
      toast.success(`Ride ${action}ed successfully`);
      toast.info(
        `Passengers have been notified that the ride is now ${action}ed`
      );

      fetchUserRides();
    } catch (error) {
      console.error(`Error ${action}ing ride:`, error);
      toast.error(`Failed to ${action} ride`);
    }
  };
  const RideCard = ({ ride }) => {
    const [isUpdated, setIsUpdated] = useState(false);

    useEffect(() => {
      setIsUpdated(true);
      const timer = setTimeout(() => setIsUpdated(false), 2000);
      return () => clearTimeout(timer);
    }, [ride.updatedAt]); // ride has to include updatedAt field (set in backend)

    const isCreator =
      ride.creator?._id === user._id || ride.creator === user._id;
    // const isAcceptor = ride.acceptor?._id === user._id || ride.acceptor === user._id;
    const [elapsedTime, setElapsedTime] = useState("");
    const timerRef = useRef(null);

    const userInterest = ride.interestedUsers.find(
      i => i.user?._id === user._id || i.user === user._id
    );
    
    const isRejected = userInterest?.status === 'rejected';
    const isInterested = userInterest?.status === 'interested';
    const isAccepted = userInterest?.status === 'accepted';
    
    
    // const isRejected = ride.interestedUsers.some(i => i.user === user._id && i.status === 'rejected');
    // const isRejected = ride.interestedUsers?.some(
    //   (i) =>
    //     i.user?._id === user._id ||
    //     i.user === user._id
    // ) && ride.interestedUsers.find(i => (i.user?._id === user._id || i.user === user._id))?.status === 'rejected';

    useEffect(() => {
      if (ride.status === "started" && ride.startedAt) {
        const startTime = new Date(ride.startedAt).getTime();
        timerRef.current = setInterval(() => {
          const now = new Date().getTime();
          const diff = now - startTime;
          const minutes = Math.floor(diff / 60000);
          const seconds = Math.floor((diff % 60000) / 1000);
          setElapsedTime(`${minutes}m ${seconds}s`);
        }, 1000);
      }
      return () => clearInterval(timerRef.current);
    }, [ride.status, ride.startedAt]);

    return (
      <Card
  sx={{
    mb: 2,
    marginTop: 15,
    border:
      ride._id === highlightedRideId
        ? "2px solid #00e676"
        : "1px solid #ccc",
    transition: "all 0.3s ease-in-out",
    boxShadow:
      ride._id === highlightedRideId ? "0 0 10px #00e676" : undefined,
    opacity:
      ride.status === "cancelled" ||
      ride.status === "completed" ||
      isRejected // ✅ FIXED HERE
        ? 0.6
        : 1,
    pointerEvents:
      ride.status === "cancelled" ||
      ride.status === "completed" ||
      isRejected // ✅ FIXED HERE
        ? "none"
        : "auto",
  }}
>

        <CardContent>
          <Typography variant="h6" gutterBottom>
            {ride.origin} → {ride.destination}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Date: {new Date(ride.date).toLocaleDateString()}
          </Typography>
          <Typography variant="body2" color="text.secondary">
          <Typography variant="body2" color="text.secondary">
  Status:{" "}
  {isCreator
    ? ride.status
    : isRejected
    ? "rejected"
    : isInterested
    ? "waiting"
    : ride.status}
</Typography>

          </Typography>
          <Typography variant="body2" color="text.secondary">
            Role: {isCreator ? "Creator" : "Acceptor"}
          </Typography>
          {!isCreator &&
            ride.interestedUsers?.some(
              (i) =>
                (i.user?._id === user._id || i.user === user._id) &&
                i.status === "interested"
            ) && (
              <Box mt={1}>
                <Chip
                  // icon={<HourglassBottomIcon />} // import this from @mui/icons-material
                  label="Waiting for approval"
                  color="warning"
                  variant="outlined"
                  size="small"
                  sx={{ borderRadius: "8px", fontWeight: 500 }}
                />
              </Box>
            )}
          {!isCreator &&
            ride.interestedUsers.some(
              (i) => i.user === user._id && i.status === "rejected"
            ) && (
              <Chip
                label="❌ Ride request was rejected"
                color="error"
                variant="outlined"
                sx={{ mt: 1 }}
              />
            )}

            {isRejected && (
              <Chip
    label="❌ You were not accepted for this ride"
    color="error"
    variant="outlined"
    sx={{ mt: 1 }}
  />
)}

        </CardContent>

        {/* Show Interested Users for Creator */}
        {isCreator && ride.interestedUsers?.length > 0 && (
          <Box mt={1} ml={2}>
            <Typography variant="subtitle2" gutterBottom>
              Interested Users:
            </Typography>
            {ride.interestedUsers.map((interest, index) => (
              <Box key={index} sx={{ mb: 1 }}>
                <Typography variant="body2">
                  {interest.user?.name || "Unnamed User"} – Status:{" "}
                  {interest.status}
                </Typography>

                {interest.status === "interested" && (
                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    sx={{ mt: 0.5 }}
                    onClick={() =>
                      handleStatusChange(ride._id, "accept", interest.user._id)
                    }
                  >
                    Accept This User
                  </Button>
                )}
              </Box>
            ))}
          </Box>
        )}
        <CardActions>
          {/* Show Start Ride button only when ride is accepted */}
          {isCreator && ride.status === "accepted" && (
            <Button
              size="small"
              color="primary"
              onClick={() => handleStatusChange(ride._id, "start")}
            >
              Start Ride
            </Button>
          )}

          {/* Show Complete Ride button only when ride is started */}
          {isCreator && ride.status === "started" && (
            <Button
              size="small"
              color="success"
              onClick={() => handleStatusChange(ride._id, "complete")}
            >
              Complete Ride
            </Button>
          )}

          {ride.status === "started" && (
            <Button
              size="small"
              color="info"
              onClick={() =>
                window.open(
                  `https://www.google.com/maps/dir/?api=1&origin=${ride.origin}&destination=${ride.destination}`,
                  "_blank"
                )
              }
            >
              View Live Map
            </Button>
          )}

          {/* Always allow cancel unless completed */}
          {ride.status !== "completed" && ride.status !== "cancelled" && (
            <Button
              size="small"
              color="error"
              onClick={() => openCancellationDialog(ride._id, "cancel")}
            >
              Cancel Ride
            </Button>
          )}

          {ride.status === "completed" && (
            <Typography variant="body2" color="primary">
              Ride Completed At:{" "}
              {ride.completedAt
                ? new Date(ride.completedAt).toLocaleTimeString()
                : "Not available"}
            </Typography>
          )}

          {ride.status === "started" && (
            <Typography variant="body2" color="primary">
              Ride Started At:{" "}
              {ride.startedAt
                ? new Date(ride.startedAt).toLocaleTimeString()
                : "Not available"}
            </Typography>
          )}

          {ride.status === "cancelled" && (
            <>
              <Typography variant="body2" color="error">
                Ride Cancelled At:{" "}
                {ride.cancelledAt
                  ? new Date(ride.cancelledAt).toLocaleString()
                  : "Not available"}
              </Typography>
              <Typography variant="body2" color="error">
                Cancellation Reason: {ride.cancellationReason || "Not provided"}
              </Typography>
            </>
          )}

          {ride.status === "started" && elapsedTime && (
            <Typography variant="body2" color="secondary">
              Duration: {elapsedTime}
            </Typography>
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

  <Dialog open={openCancelModal} onClose={() => setOpenCancelModal(false)}>
    <DialogTitle>Select Cancellation Reason</DialogTitle>
    <DialogContent>
      <FormControl fullWidth>
        <InputLabel>Reason</InputLabel>
        <Select
          value={cancelReason}
          onChange={(e) => setCancelReason(e.target.value)}
          label="Reason"
        >
          {cancellationReasons.map((reason, index) => (
            <MenuItem key={index} value={reason}>
              {reason}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </DialogContent>
    <DialogActions>
      <Button onClick={() => setOpenCancelModal(false)}>Close</Button>
      <Button color="error" onClick={confirmCancel}>
        Confirm Cancel
      </Button>
    </DialogActions>
  </Dialog>;
  <Dialog open={openReviewModal} onClose={() => setOpenReviewModal(false)}>
    <DialogTitle>Rate Your Ride</DialogTitle>
    <DialogContent>
      <Box mt={2}>
        <Rating
          name="rating"
          value={ratingValue}
          onChange={(e, newValue) => setRatingValue(newValue)}
        />
        <TextField
          multiline
          fullWidth
          rows={3}
          label="Leave a comment (optional)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          sx={{ mt: 2 }}
        />
      </Box>
    </DialogContent>
    <DialogActions>
      <Button onClick={() => setOpenReviewModal(false)}>Cancel</Button>
      <Button
        onClick={async () => {
          try {
            await rideService.submitReview({
              rideId: reviewRide._id,
              rating: ratingValue,
              comment,
              toUserId: reviewRide.creator._id || reviewRide.creator,
            });

            //  Fetch updated profile to get new reviews and averageRating
            const profileRes = await api.get("/users/me");
            updateUser(profileRes.data);

            toast.success("Thanks for your feedback!");
            setOpenReviewModal(false);
            setRatingValue(0);
            setComment("");
          } catch (err) {
            toast.error("Error submitting review");
          }
        }}
        variant="contained"
      >
        Submit Review
      </Button>
    </DialogActions>
  </Dialog>;

  return (
    <Container maxWidth="lg" sx={{ mt: 14, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={3}
            >
              <Typography variant="h4" component="h1">
                Welcome, {user?.name}!
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("/rides/create")}
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
              userRides.map((ride) => <RideCard key={ride._id} ride={ride} />)
            ) : (
              <Typography color="text.secondary">
                No rides found. Create a new ride or accept an available one!
              </Typography>
            )}
            {user.ratings?.length > 0 && (
              <>
                <Typography variant="h6" sx={{ mt: 4 }}>
                  Past Reviews
                </Typography>
                {user.ratings.map((review, idx) => (
                  <Paper key={idx} sx={{ p: 2, mb: 2 }}>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Rating value={review.rating} precision={0.5} readOnly />
                      <Typography variant="caption">
                        {new Date(review.date).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {review.comment}
                    </Typography>
                  </Paper>
                ))}
              </>
            )}
          </Paper>
        </Grid>
      </Grid>
      <Dialog open={openCancelModal} onClose={() => setOpenCancelModal(false)}>
        <DialogTitle>Select Cancellation Reason</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 1 }}>
            <InputLabel>Reason</InputLabel>
            <Select
              value={cancelReason}
              onChange={(e) => {
                setCancelReason(e.target.value);
                if (e.target.value !== "Other") {
                  setCustomReason(""); // reset if not "Other"
                }
              }}
              label="Reason"
            >
              {cancellationReasons.map((reason, index) => (
                <MenuItem key={index} value={reason}>
                  {reason}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {cancelReason === "Other" && (
            <FormControl fullWidth sx={{ mt: 2 }}>
              {/* <InputLabel htmlFor="custom-reason"></InputLabel> */}
              <input
                id="custom-reason"
                type="text"
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Please enter your reason"
                style={{
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  marginTop: "8px",
                }}
              />
            </FormControl>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCancelModal(false)}>Close</Button>
          <Button color="error" onClick={confirmCancel}>
            Confirm Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Dashboard;
