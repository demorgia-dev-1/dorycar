import {
  Grid,
  Typography,
  Card,
  CardContent,
  Chip,
  Avatar,
  Box,
  Rating,
  Container,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { rideService } from "../../services/api";
import RideDetailsModal from "./RideDetailsModal";

const RideList = ({ searchResults }) => {
  const [selectedRide, setSelectedRide] = useState(null);
  const navigate = useNavigate();

  const handleBookRide = async (rideId) => {
    try {
      await rideService.expressInterest(rideId);
      toast.success("Ride booked successfully!");
      navigate('/dashboard')
      setSelectedRide(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to book ride");
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

  if (!Array.isArray(searchResults) || searchResults.length === 0) {
    return (
      <Typography variant="h6" align="center" color="text.secondary">
        No ride matches your search.
      </Typography>
    );
  }

  return (
    <Container maxWidth="md" sx={{ my: 4 }}>
      <CardContent>
        <Grid container spacing={2}>
          {searchResults.length > 0 ? (
            searchResults.map((ride) => (
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
                        ({ride.creator?.averageRating?.toFixed(1) || "N/A"})
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
            <RideDetailsModal
              selectedRide={selectedRide}
              onClose={() => setSelectedRide(null)}
              onBook={() => {
                handleBookRide(selectedRide._id);
                setSelectedRide(null);
              }}
              onChat={() => handleChatWithDriver(selectedRide.creator._id)}
              onMap={() =>
                handleViewMap(selectedRide.origin, selectedRide.destination)
              }
              onShare={() => handleShareRide(selectedRide)}
            />
          )}
        </Grid>
      </CardContent>
    </Container>
  );
};

export default RideList;
