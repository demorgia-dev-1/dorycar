import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Avatar,
  Box,
  Divider,
  Button,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";

const RideDetailsModal = ({
  selectedRide,
  onClose,
  onBook,
  onChat,
  onMap,
  onShare,
}) => {
  if (!selectedRide) return null;

  return (
    <Dialog open={true} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Ride Details</DialogTitle>
      <DialogContent dividers>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <Avatar src={selectedRide.creator?.profileImage} />
          <Box sx={{ textTransform: "capitalize" }}>
            <Typography fontWeight="bold">
              {selectedRide.creator?.name}
            </Typography>
            <Typography variant="body2">
              <span style={{ color: "#fbc02d" }}>
                <StarIcon sx={{ mr: 1 }} />
              </span>
              {selectedRide.creator?.averageRating?.toFixed(1) || "N/A"} (
              {selectedRide.creator?.ratings?.length || 0} rides)
            </Typography>
          </Box>
        </Box>

        <Box sx={{ textTransform: "capitalize" }}>
          <Typography>
            <strong>Gender:</strong> {selectedRide.creator?.gender}
          </Typography>
          <Typography>
            <strong>Contact:</strong> {selectedRide.creator?.phone}
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
              <strong>Car:</strong> {selectedRide.creator.vehicle.make}
            </Typography>
            <Typography>
              <strong>Model:</strong> {selectedRide.creator.vehicle.model}
            </Typography>
            <Typography>
              <strong>Color:</strong> {selectedRide.creator.vehicle.color}
            </Typography>
            <Typography>
              <strong>Registration:</strong>{" "}
              {selectedRide.creator.vehicle.registration}
            </Typography>
            <Typography>
              <strong>Year:</strong> {selectedRide.creator.vehicle.year}
            </Typography>
            <Typography>
              <strong>Fuel Type:</strong> {selectedRide.creator.vehicle.fuel}
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

        <Divider sx={{ my: 2 }} />
        <Typography>
          <strong>Fare per Seat:</strong> ₹{selectedRide.price}
        </Typography>
        <Typography>
          <strong>Payment Methods:</strong>{" "}
          {selectedRide.paymentMethods?.join(", ") || "Not specified"}
        </Typography>
        {selectedRide.upiId && (
          <Typography sx={{ mt: 1 }}>
            <strong>UPI ID:</strong> {selectedRide.upiId}
          </Typography>
        )}

        {selectedRide.qrImageUrl && (
          <Box sx={{ mt: 2 }}>
            <Typography>
              <strong>QR Code:</strong>
            </Typography>
            <img
              src={selectedRide.qrImageUrl}
              alt="QR Code"
              style={{ maxWidth: "200px", marginTop: "8px", borderRadius: "8px" }}
            />
          </Box>
        )}

        {selectedRide.fareSplitShown && (
          <Typography color="success.main">Fare Split Available</Typography>
        )}

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle2">Preferences:</Typography>
        <ul>
          <li><strong>AC:</strong> {selectedRide.ridePreference?.ac ? "Yes" : "No"}</li>
          <li><strong>Smoking Allowed:</strong> {selectedRide.ridePreference?.smoking ? "Yes" : "No"}</li>
          <li><strong>Music Allowed:</strong> {selectedRide.ridePreference?.music ? "Yes" : "No"}</li>
          <li><strong>Luggage Allowed:</strong> {selectedRide.ridePreference?.luggage ? "Yes" : "No"}</li>
          <li><strong>Women-only Ride:</strong> {selectedRide.ridePreference?.womenOnly ? "Yes" : "No"}</li>
        </ul>

        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle2">Verifications:</Typography>
        <ul>
          <li><strong>ID:</strong> {selectedRide.verified?.id ? "Verified" : "Not Verified"}</li>
          <li><strong>Phone:</strong> {selectedRide.verified?.phone ? "Verified" : "Not Verified"}</li>
          <li><strong>License:</strong> {selectedRide.verified?.license ? "Verified" : "Not Verified"}</li>
          <li><strong>Emergency Contact:</strong> {selectedRide.verified?.emergencyContact ? "Available" : "Not Provided"}</li>
        </ul>
      </DialogContent>
      <DialogActions>
        <Button onClick={onBook} variant="contained" color="primary">Book</Button>
        <Button onClick={onChat} variant="outlined">Chat</Button>
        <Button onClick={onMap} variant="outlined">Map</Button>
        <Button onClick={onShare} variant="text">Share</Button>
        <Button onClick={onClose} color="error">Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default RideDetailsModal;
