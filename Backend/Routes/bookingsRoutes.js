const express = require('express');
const router = express.Router();
const bookingsController = require('../controllers/bookingsController');

// Create a new booking
router.post("/", bookingsController.createBooking);


// Get bookings by facility ID (admin)
router.get("/facility/:facilityID", bookingsController.getBookingsByFacilityId);

// Get bookings by user ID (admin)
router.get("/user/:userID", bookingsController.getBookingsByUserId);

// Get bookings by timeslot ID (admin)
router.get("/timeslot/:timeSlotID", bookingsController.getBookingsByTimeSlotId);

// Get booking by ID (admin)
router.get("/:id", bookingsController.getBookingById);

// Update booking status by ID (admin)
router.put("/:id", bookingsController.updateBooking);

router.put("/cancel/:id", bookingsController.cancelBooking);

// Delete booking by ID (admin)
router.delete("/:id", bookingsController.deleteBooking);

module.exports = router;
