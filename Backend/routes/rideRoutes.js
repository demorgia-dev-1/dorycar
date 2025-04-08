const express = require("express");
const router = express.Router();
const Ride = require("../models/Ride");
const auth = require("../middleware/auth");
const User = require("../models/User");

router.post("/create", auth, async (req, res) => {
  console.log("Received request data:", req.body, "User:", req.userId);

  try {
    const {
      origin,
      destination,
      date,
      seats,
      price,
      arrivalTime,
      departureTime,
      paymentMethods,
    } = req.body;

    // Fetch user
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check required fields for vehicle
    const vehicle = user.vehicle || {};
    const missingFields = [];

    const requiredVehicleFields = [
      "type",
      "make",
      "model",
      "registration",
      "seats",
      "fuel",
      "vin",
    ];
    requiredVehicleFields.forEach((field) => {
      if (!vehicle[field]) {
        missingFields.push(`vehicle.${field}`);
      }
    });

    // Check other user required fields
    if (!user.phone) missingFields.push("phone");
    if (!user.gender) missingFields.push("gender");
    if (!user.emergencyContact) missingFields.push("emergencyContact");

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: "Please complete your profile before creating a ride",
        missingFields,
      });
    }

    // Create and save the ride
    const ride = new Ride({
      creator: req.userId,
      origin,
      destination,
      date,
      seats,
      price,
      arrivalTime,
      departureTime,
      paymentMethods,
    });

    await ride.save();

    req.app.get("io").emit("ride-updated", ride);
    res.status(201).json(ride);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating ride", error: error.message });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const { origin, destination, date } = req.query;

    const filter = {};

    if (origin) {
      filter.origin = { $regex: new RegExp(origin, "i") };
    }

    if (destination) {
      filter.destination = { $regex: new RegExp(destination, "i") };
    }

    if (date) {
      // Convert local date string to midnight UTC
      const searchDate = new Date(date);
      const utcStart = new Date(
        Date.UTC(
          searchDate.getFullYear(),
          searchDate.getMonth(),
          searchDate.getDate()
        )
      );

      const utcEnd = new Date(
        Date.UTC(
          searchDate.getFullYear(),
          searchDate.getMonth(),
          searchDate.getDate() + 1
        )
      );

      filter.date = {
        $gte: utcStart,
        $lt: utcEnd,
      };
    }

    filter.status = {
      $in: ["pending", "accepted", "started", "completed", "cancelled"],
    };

    const rides = await Ride.find(filter)
      // .populate('creator', 'name')
      .populate(
        "creator",
        "name profileImage phone gender emergencyContact preferredCommunication ridePreference vehicle averageRating ratings"
      )

      .populate("acceptor", "name")
      .populate("interestedUsers.user", "name")
      .sort({ createdAt: -1 });
    // .lean();

    res.json(rides);
  } catch (error) {
    console.error("Error in /api/rides route:", error.message);
    res
      .status(500)
      .json({ message: "Error fetching rides", error: error.message });
  }
});

router.post("/:rideId/interest", auth, async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.rideId);
    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    if (ride.creator.toString() === req.userId) {
      return res
        .status(400)
        .json({ message: "Cannot express interest in your own ride" });
    }

    const alreadyInterested = ride.interestedUsers.find(
      (interest) => interest.user.toString() === req.userId
    );

    if (alreadyInterested) {
      return res
        .status(400)
        .json({ message: "Already expressed interest in this ride" });
    }

    ride.interestedUsers.push({
      user: req.userId,
      status: "interested",
    });

    await ride.save();
    const updatedRide = await Ride.findById(ride._id)
      .populate("creator", "name")
      .populate("acceptor", "name")
      .populate("interestedUsers.user", "name");

    req.app.get("io").emit("ride-updated", updatedRide);

    req.app
      .get("io")
      .to(ride.creator._id.toString())
      .emit("ride-notification", {
        message: ` Someone has shown interest in your ride from ${ride.origin} to ${ride.destination}.`,
      });
    res.json(ride);
  } catch (error) {
    res.status(500).json({
      message: "Error expressing interest",
      error: error.message,
    });
  }
});

// Accept a ride (for ride creator to accept an interested user)
router.post("/:rideId/accept/:userId", auth, async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.rideId);
    if (!ride) return res.status(404).json({ message: "Ride not found" });

    if (ride.creator.toString() !== req.userId)
      return res.status(403).json({ message: "Only ride creator can accept users" });

    const interest = ride.interestedUsers.find(
      (i) => i.user.toString() === req.params.userId
    );

    if (!interest) return res.status(404).json({ message: "User has not expressed interest" });

    if (interest.status === "accepted") {
      return res.status(400).json({ message: "User already accepted" });
    }

    interest.status = "accepted";
    ride.acceptor = null; 

    await ride.save();
    req.app.get("io").emit("ride-updated", ride);

    req.app.get("io").to(req.params.userId).emit("ride-notification", {
      message: ` You’ve been accepted for the ride from ${ride.origin} to ${ride.destination}`,
    });

    res.json(ride);
  } catch (error) {
    res.status(500).json({ message: "Error accepting ride", error: error.message });
  }
});

router.put("/:rideId/start", auth, async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.rideId);

    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    if (ride.creator.toString() !== req.userId) {
      return res.status(403).json({ message: "Only ride creator can start the ride" });
    }

    const hasAcceptedUsers = ride.interestedUsers.some(
      (interest) => interest.status === "accepted"
    );

    if (!hasAcceptedUsers) {
      return res.status(400).json({
        message: "You must accept at least one user before starting the ride",
      });
    }

    // Mark ride as started
    ride.status = "started";
    ride.startedAt = new Date();

    // Reject all non-accepted users
    ride.interestedUsers = ride.interestedUsers.map((interest) => {
      if (interest.status !== "accepted") {
        interest.status = "rejected";
        const rejectionMessage = ` Your request for the ride from ${ride.origin} to ${ride.destination} was not accepted.`;

        // Send rejection notification
        req.app.get("io").to(interest.user.toString()).emit("ride-notification", {
          message: rejectionMessage,
          type: "rejected",
        });

        ride.notifications.push({ user: interest.user, message: rejectionMessage });
      }
      return interest;
    });

    await ride.save();

    const updatedRide = await Ride.findById(ride._id)
      .populate("creator", "name")
      .populate("acceptor", "name")
      .populate("interestedUsers.user", "name");

    req.app.get("io").emit("ride-updated", updatedRide);

    // Notify accepted users that ride has started
    ride.interestedUsers.forEach((interest) => {
      if (interest.status === "accepted") {
        req.app.get("io").to(interest.user.toString()).emit("ride-notification", {
          message: ` Your ride from ${ride.origin} to ${ride.destination} has started.`,
        });
      }
    });

    res.json(updatedRide);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error starting ride", error: error.message });
  }
});


// Send a message in a ride chat

router.post("/:rideId/messages", auth, async (req, res) => {
  try {
    const { content } = req.body;
    const ride = await Ride.findById(req.params.rideId);

    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    // Check if user is either creator, acceptor, or interested user
    const isParticipant =
      ride.creator.toString() === req.userId ||
      (ride.acceptor && ride.acceptor.toString() === req.user.userId) ||
      ride.interestedUsers.some(
        (interest) => interest.user.toString() === req.user.userId
      );

    if (!isParticipant) {
      return res
        .status(403)
        .json({ message: "Not authorized to send messages in this ride chat" });
    }

    ride.messages.push({
      sender: req.user.userId,
      content,
    });

    await ride.save();

    // Populate sender information for the new message
    const populatedRide = await Ride.findById(ride._id)
      .populate("messages.sender", "name")
      .populate("creator", "name")
      .populate("acceptor", "name")
      .populate("interestedUsers.user", "name");

    req.app.get("io").emit("ride-updated", populatedRide);

    res.json(populatedRide);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error sending message", error: error.message });
  }
});

// Get messages for a ride
router.get("/:rideId/messages", auth, async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.rideId)
      .populate("messages.sender", "name")
      .populate("creator", "name")
      .populate("acceptor", "name");

    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    // Check if user is either creator, acceptor, or interested user
    const isParticipant =
      ride.creator.toString() === req.userId ||
      (ride.acceptor && ride.acceptor.toString() === req.user.userId) ||
      ride.interestedUsers.some(
        (interest) => interest.user.toString() === req.user.userId
      );

    if (!isParticipant) {
      return res
        .status(403)
        .json({ message: "Not authorized to view messages" });
    }
    req.app.get("io").emit("ride-updated", ride);

    res.json(ride.messages);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching messages", error: error.message });
  }
});

router.get("/search", auth, async (req, res) => {
  try {
    const { origin, destination, date } = req.query;

    const filter = {
      status: { $in: ["pending", "accepted", "started"] },
    };

    if (origin) {
      filter.origin = { $regex: new RegExp(origin, "i") };
    }

    if (destination) {
      filter.destination = { $regex: new RegExp(destination, "i") };
    }

    if (date) {
      const searchDate = new Date(date);
      const utcStart = new Date(
        Date.UTC(
          searchDate.getFullYear(),
          searchDate.getMonth(),
          searchDate.getDate()
        )
      );
      const utcEnd = new Date(
        Date.UTC(
          searchDate.getFullYear(),
          searchDate.getMonth(),
          searchDate.getDate() + 1
        )
      );
      filter.date = { $gte: utcStart, $lt: utcEnd };
    }

    const rides = await Ride.find(filter)
      .populate(
        "creator",
        "name profileImage phone gender emergencyContact preferredCommunication ridePreference vehicle averageRating ratings"
      )
      .populate("acceptor", "name")
      .populate("interestedUsers.user", "name")
      .sort({ createdAt: -1 });

    res.json(rides);
  } catch (error) {
    console.error("Error in /api/rides/search:", error.message);
    res
      .status(500)
      .json({ message: "Error fetching searched rides", error: error.message });
  }
});

// Get user's rides (created, accepted, and interested)
router.get("/my-rides", auth, async (req, res) => {
  try {
    const createdRides = await Ride.find({ creator: req.user.userId })
      .populate("acceptor", "name")
      .populate("interestedUsers.user", "name");

    const acceptedRides = await Ride.find({
      acceptor: req.user.userId,
    }).populate("creator", "name");

    const interestedRides = await Ride.find({
      "interestedUsers.user": req.user.userId,
    }).populate("creator", "name");

    res.json({
      created: createdRides,
      accepted: acceptedRides,
      interested: interestedRides,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching user rides", error: error.message });
  }
});

// Complete a ride
router.put("/:rideId/complete", auth, async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.rideId);
    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    if (ride.creator.toString() !== req.userId) {
      return res.status(403).json({ message: "Only ride creator can complete the ride" });
    }
    
    if (ride.status !== "started") {
      return res.status(400).json({ message: "Only started rides can be completed" });
    }
    
    ride.status = "completed";
    ride.completedAt = new Date();
    
    await ride.save();
    
    const updatedRide = await Ride.findById(ride._id)
      .populate("creator", "name")
      .populate("acceptor", "name")
      .populate("interestedUsers.user", "name");
    
    req.app.get("io").emit("ride-updated", updatedRide);
    
    ride.interestedUsers.forEach((i) => {
      if (i.status === "accepted") {
        req.app.get("io").to(i.user.toString()).emit("ride-notification", {
          message: ` Your ride from ${ride.origin} to ${ride.destination} has been completed.`,
          type: "completed",
        });
      }
    });
    
    res.json(updatedRide);
    
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error completing ride", error: error.message });
  }
});

router.post("/:rideId/review", auth, async (req, res) => {
  try {
    const { rideId } = req.params;
    const { rating, comment, toUserId } = req.body;
    const fromUserId = req.userId;

    // Add the review to the recipient user
    const user = await User.findById(toUserId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.ratings.push({
      rating,
      comment,
      by: fromUserId,
      date: new Date(),
    });

    // Optional: Update averageRating
    const total = user.ratings.reduce((sum, r) => sum + r.rating, 0);
    user.averageRating = total / user.ratings.length;

    await user.save();

    res.json({ message: "Review submitted" });
  } catch (err) {
    console.error("Submit review error:", err);
    res.status(500).json({ message: "Failed to submit review" });
  }
});


// Cancel a ride
router.put("/:rideId/cancel", auth, async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.rideId);
    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    if (
      ride.creator.toString() !== req.userId &&
      ride.acceptor?.toString() !== req.user.userId
    ) {
      return res
        .status(403)
        .json({ message: "Only ride creator or acceptor can cancel the ride" });
    }

    if (ride.status === "completed" || ride.status === "cancelled") {
      return res
        .status(400)
        .json({
          message: "Cannot cancel completed or already cancelled rides",
        });
    }

    ride.status = "cancelled";
    ride.cancelledAt = new Date();
    ride.cancellationReason =
      req.body.cancellationReason || "No reason provided";

    await ride.save();
    if (ride.acceptor) {
      const updatedRide = await Ride.findById(ride._id)
        .populate("creator", "name")
        .populate("acceptor", "name")
        .populate("interestedUsers.user", "name");

      req.app.get("io").emit("ride-updated", updatedRide);

      req.app
  .get("io")
  .to(ride.acceptor.toString())
  .emit("ride-notification", {
    message: ` Your ride from ${ride.origin} to ${ride.destination} was cancelled. Reason: ${ride.cancellationReason}`,
    type: "cancelled",
  });

ride.interestedUsers.forEach((i) => {
  req.app.get("io").to(i.user.toString()).emit("ride-notification", {
    message: ` Ride from ${ride.origin} to ${ride.destination} was cancelled. Reason: ${ride.cancellationReason}`,
    type: "cancelled",
  })
})
    }

    res.json(ride);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error cancelling ride", error: error.message });
  }
});

module.exports = router;
