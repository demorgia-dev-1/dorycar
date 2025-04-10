// src/pages/ChatPage.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import RideChat from "../rides/RideChat"; // Adjust the path
import { rideService } from "../../services/rideService"; // for fetching ride info

const ChatPage = () => {
  const { driverId } = useParams();
  const [rideId, setRideId] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserAndRide = async () => {
      try {
        const profile = await rideService.userProfile();
        setUser(profile);

        // Optionally, fetch the latest ride between user and driver
        const rides = await rideService.getRides(); // all rides
        const matchedRide = rides.find(
          (r) =>
            (r.creator._id === driverId || r.acceptor === driverId) &&
            r.interestedUsers.some((u) => u.user === profile._id)
        );

        if (matchedRide) {
          setRideId(matchedRide._id);
        }
      } catch (err) {
        console.error("Error loading chat:", err);
      }
    };

    fetchUserAndRide();
  }, [driverId]);

  if (!rideId || !user) return <p>Loading chat...</p>;

  return <RideChat rideId={rideId} currentUser={user} />;
};

export default ChatPage;
