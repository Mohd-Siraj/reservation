// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  bookings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
    },
  ],
});

// models/Booking.js
const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  seats: [
    {
      type: Number,
      required: true,
    },
  ],
  bookingDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["active", "cancelled"],
    default: "active",
  },
});

// routes/booking.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Booking = require("../models/Booking");

// Get all booked seats
router.get("/booked-seats", async (req, res) => {
  try {
    const bookings = await Booking.find({ status: "active" });
    const bookedSeats = bookings.reduce((acc, booking) => {
      return [...acc, ...booking.seats];
    }, []);
    res.json(bookedSeats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Book seats
router.post("/book", auth, async (req, res) => {
  try {
    const { seats } = req.body;

    // Validate number of seats
    if (!seats || seats.length === 0 || seats.length > 7) {
      return res.status(400).json({ message: "Invalid number of seats" });
    }

    // Check if seats are already booked
    const existingBookings = await Booking.find({
      seats: { $in: seats },
      status: "active",
    });

    if (existingBookings.length > 0) {
      return res.status(400).json({ message: "Some seats are already booked" });
    }

    // Create new booking
    const booking = new Booking({
      user: req.user._id,
      seats,
    });

    await booking.save();
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Cancel booking
router.post("/cancel/:id", auth, async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = "cancelled";
    await booking.save();
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
