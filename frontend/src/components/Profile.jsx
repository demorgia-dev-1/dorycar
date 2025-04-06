import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Divider,
  TextField,
  Button,
  IconButton,
  MenuItem,
  InputLabel,
  Select,
  FormControl,
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { useAuth } from "../context/AuthContext";
import { updateUser as updateUserAPI } from "../services/api";

const genders = ["Male", "Female", "Other"];
const vehicleTypes = ["Car", "SUV", "Bike", "Van"];
const fuelTypes = ["Petrol", "Diesel", "CNG", "Electric"];
const communicationPrefs = ["Chat", "Call", "Both"];

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    gender: "",
    phone: "",
    dob: "",
    profileImage: "",
    emergencyContact: "",
    preferredCommunication: "",
    ridePreference: { gender: "", music: "", chat: "", ac: "" },
    vehicle: {
      type: "",
      make: "",
      model: "",
      color: "",
      year: "",
      registration: "",
      seats: "",
      ac: "",
      fuel: "",
      luggage: "",
      vin: "",
    },
    vehicleImage: "",
    rcDocument: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        gender: user.gender || "",
        phone: user.phone || "",
        dob: user.dob || "",
        profileImage: user.profileImage || "",
        emergencyContact: user.emergencyContact || "",
        preferredCommunication: user.preferredCommunication || "",
        ridePreference: user.ridePreference || {
          gender: "",
          music: "",
          chat: "",
          ac: "",
        },
        vehicle: user.vehicle || {
          type: "",
          make: "",
          model: "",
          color: "",
          year: "",
          registration: "",
          seats: "",
          ac: "",
          fuel: "",
          luggage: "",
        },
        vehicleImage: user.vehicleImage || "",
        rcDocument: user.rcDocument || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNestedChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const handleFileUpload = (e, key) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, [key]: file }));
    }
  };

  const handleSave = async () => {
    try {
      let uploadedProfileImage = formData.profileImage;
      let uploadedVehicleImage = formData.vehicleImage;
      let uploadedRcDocument = formData.rcDocument;

      // Upload profile image
      if (selectedFile) {
        const form = new FormData();
        form.append("file", selectedFile);
        form.append("upload_preset", "dorycar_unsigned");

        const res = await fetch(
          "https://api.cloudinary.com/v1_1/dorycar/image/upload",
          {
            method: "POST",
            body: form,
          }
        );
        const data = await res.json();
        uploadedProfileImage = data.secure_url;
      }

      // Upload vehicle image if it's a file
      if (formData.vehicleImage instanceof File) {
        const form = new FormData();
        form.append("file", formData.vehicleImage);
        form.append("upload_preset", "dorycar_unsigned");
        const res = await fetch(
          "https://api.cloudinary.com/v1_1/dorycar/image/upload",
          {
            method: "POST",
            body: form,
          }
        );
        const data = await res.json();
        uploadedVehicleImage = data.secure_url;
      }

      // Upload RC document if it's a file
      if (formData.rcDocument instanceof File) {
        const form = new FormData();
        form.append("file", formData.rcDocument);
        form.append("upload_preset", "dorycar_unsigned");
        const res = await fetch(
          "https://api.cloudinary.com/v1_1/dorycar/image/upload",
          {
            method: "POST",
            body: form,
          }
        );
        const data = await res.json();
        uploadedRcDocument = data.secure_url;
      }

      const updated = {
        ...formData,
        profileImage: uploadedProfileImage,
        vehicleImage: uploadedVehicleImage,
        rcDocument: uploadedRcDocument,
      };

      await updateUserAPI(user._id, updated);
      updateUser(updated); // Update context
      setEditMode(false);
    } catch (err) {
      console.error("Failed to update profile:", err.message);
    }
  };

  if (!user) return null;

  return (
    <Box sx={{ mt: 15, display: "flex", justifyContent: "center" }}>
      <Paper elevation={3} sx={{ p: 4, width: 600 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: 2,
            position: "relative",
          }}
        >
          <Avatar
            src={formData.profileImage}
            alt={user.name}
            sx={{ width: 80, height: 80 }}
          />
          {editMode && (
            <IconButton
              component="label"
              sx={{ position: "absolute", bottom: 0, right: "30%" }}
            >
              <PhotoCamera />
              <input
                type="file"
                hidden
                onChange={(e) => setSelectedFile(e.target.files[0])}
              />
            </IconButton>
          )}
        </Box>

        <Typography variant="h5" align="center" gutterBottom>
          {editMode ? "Edit Profile" : "Profile"}
        </Typography>
        <Divider sx={{ mb: 2 }} />

        {editMode ? (
          <>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="DOB"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Emergency Contact"
              name="emergencyContact"
              value={formData.emergencyContact}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Gender</InputLabel>
              <Select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                label="Gender"
              >
                {genders.map((g) => (
                  <MenuItem key={g} value={g}>
                    {g}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Preferred Communication</InputLabel>
              <Select
                name="preferredCommunication"
                value={formData.preferredCommunication}
                onChange={handleChange}
              >
                {communicationPrefs.map((opt) => (
                  <MenuItem key={opt} value={opt}>
                    {opt}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Typography variant="h6">Ride Preferences</Typography>
            <TextField
              label="Gender Preference"
              fullWidth
              sx={{ my: 1 }}
              value={formData.ridePreference.gender}
              onChange={(e) =>
                handleNestedChange("ridePreference", "gender", e.target.value)
              }
            />
            <TextField
              label="Music Preference"
              fullWidth
              sx={{ my: 1 }}
              value={formData.ridePreference.music}
              onChange={(e) =>
                handleNestedChange("ridePreference", "music", e.target.value)
              }
            />
            <TextField
              label="Chat Preference"
              fullWidth
              sx={{ my: 1 }}
              value={formData.ridePreference.chat}
              onChange={(e) =>
                handleNestedChange("ridePreference", "chat", e.target.value)
              }
            />
            <TextField
              label="AC Preference"
              fullWidth
              sx={{ my: 1 }}
              value={formData.ridePreference.ac}
              onChange={(e) =>
                handleNestedChange("ridePreference", "ac", e.target.value)
              }
            />

            <Typography variant="h6" mt={2}>
              Vehicle Info
            </Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Vehicle Type</InputLabel>
              <Select
                value={formData.vehicle.type}
                onChange={(e) =>
                  handleNestedChange("vehicle", "type", e.target.value)
                }
              >
                {vehicleTypes.map((v) => (
                  <MenuItem key={v} value={v}>
                    {v}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Vehicle VIN"
              value={formData.vehicle.vin || ""}
              onChange={(e) =>
                handleNestedChange("vehicle", "vin", e.target.value)
              }
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Make"
              value={formData.vehicle.make}
              onChange={(e) =>
                handleNestedChange("vehicle", "make", e.target.value)
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Model"
              value={formData.vehicle.model}
              onChange={(e) =>
                handleNestedChange("vehicle", "model", e.target.value)
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Color"
              value={formData.vehicle.color}
              onChange={(e) =>
                handleNestedChange("vehicle", "color", e.target.value)
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Year"
              value={formData.vehicle.year}
              onChange={(e) =>
                handleNestedChange("vehicle", "year", e.target.value)
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Registration"
              value={formData.vehicle.registration}
              onChange={(e) =>
                handleNestedChange("vehicle", "registration", e.target.value)
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Seats"
              value={formData.vehicle.seats}
              onChange={(e) =>
                handleNestedChange("vehicle", "seats", e.target.value)
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="AC"
              value={formData.vehicle.ac}
              onChange={(e) =>
                handleNestedChange("vehicle", "ac", e.target.value)
              }
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Fuel Type</InputLabel>
              <Select
                value={formData.vehicle.fuel}
                onChange={(e) =>
                  handleNestedChange("vehicle", "fuel", e.target.value)
                }
              >
                {fuelTypes.map((f) => (
                  <MenuItem key={f} value={f}>
                    {f}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Luggage Space"
              value={formData.vehicle.luggage}
              onChange={(e) =>
                handleNestedChange("vehicle", "luggage", e.target.value)
              }
              sx={{ mb: 2 }}
            />
            <Typography variant="h6">Uploads</Typography>
            <Button
              component="label"
              variant="outlined"
              fullWidth
              sx={{ mb: 2 }}
            >
              Upload Vehicle Image
              <input
                type="file"
                hidden
                onChange={(e) => handleFileUpload(e, "vehicleImage")}
              />
            </Button>
            <Button
              component="label"
              variant="outlined"
              fullWidth
              sx={{ mb: 2 }}
            >
              Upload RC Document
              <input
                type="file"
                hidden
                onChange={(e) => handleFileUpload(e, "rcDocument")}
              />
            </Button>

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Button variant="contained" onClick={handleSave}>
                Save
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => setEditMode(false)}
              >
                Cancel
              </Button>
            </Box>
          </>
        ) : (
          <>
            {user.name && (
              <Typography>
                <strong>Name:</strong> {user.name}
              </Typography>
            )}
            {user.email && (
              <Typography>
                <strong>Email:</strong> {user.email}
              </Typography>
            )}
            {user.phone && (
              <Typography>
                <strong>Phone:</strong> {user.phone}
              </Typography>
            )}
            {user.gender && (
              <Typography>
                <strong>Gender:</strong> {user.gender}
              </Typography>
            )}
            {formData.dob && (
              <Typography>
                <strong>DOB:</strong> {formData.dob}
              </Typography>
            )}
            {formData.emergencyContact && (
              <Typography>
                <strong>Emergency Contact:</strong> {formData.emergencyContact}
              </Typography>
            )}
            {user.preferredCommunication && (
              <Typography>
                <strong>Preferred Communication:</strong>{" "}
                {user.preferredCommunication}
              </Typography>
            )}

            {formData.ridePreference.gender && (
              <Typography>
                <strong>Gender Preference:</strong>{" "}
                {formData.ridePreference.gender}
              </Typography>
            )}
            {formData.ridePreference.music && (
              <Typography>
                <strong>Music Preference:</strong>{" "}
                {formData.ridePreference.music}
              </Typography>
            )}
            {formData.ridePreference.chat && (
              <Typography>
                <strong>Chat Preference:</strong> {formData.ridePreference.chat}
              </Typography>
            )}
            {formData.ridePreference.ac && (
              <Typography>
                <strong>AC Preference:</strong> {formData.ridePreference.ac}
              </Typography>
            )}

            {formData.vehicle?.type && (
              <>
                <Typography sx={{ mt: 2 }}>
                  <strong>Vehicle:</strong> {formData.vehicle.type}
                </Typography>
                {formData.vehicle.make && (
                  <Typography>
                    <strong>Make:</strong> {formData.vehicle.make}
                  </Typography>
                )}
                {formData.vehicle.model && (
                  <Typography>
                    <strong>Model:</strong> {formData.vehicle.model}
                  </Typography>
                )}
                {formData.vehicle.color && (
                  <Typography>
                    <strong>Color:</strong> {formData.vehicle.color}
                  </Typography>
                )}
                {formData.vehicle.year && (
                  <Typography>
                    <strong>Year:</strong> {formData.vehicle.year}
                  </Typography>
                )}
                {formData.vehicle.registration && (
                  <Typography>
                    <strong>Registration:</strong>{" "}
                    {formData.vehicle.registration}
                  </Typography>
                )}
                {formData.vehicle.vin && (
                  <Typography>
                    <strong>VIN (Vehicle Identification Number):</strong> {formData.vehicle.vin}
                  </Typography>
                )}
                {formData.vehicle.seats && (
                  <Typography>
                    <strong>Seats:</strong> {formData.vehicle.seats}
                  </Typography>
                )}
                {formData.vehicle.ac && (
                  <Typography>
                    <strong>AC:</strong> {formData.vehicle.ac}
                  </Typography>
                )}
                {formData.vehicle.fuel && (
                  <Typography>
                    <strong>Fuel:</strong> {formData.vehicle.fuel}
                  </Typography>
                )}
                {formData.vehicle.luggage && (
                  <Typography>
                    <strong>Luggage Space:</strong> {formData.vehicle.luggage}
                  </Typography>
                )}
              </>
            )}

            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3 }}
              onClick={() => setEditMode(true)}
            >
              Edit Profile
            </Button>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default Profile;
