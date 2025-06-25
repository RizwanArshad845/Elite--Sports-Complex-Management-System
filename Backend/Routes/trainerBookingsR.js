const express = require("express");
const {
    createTrainerBooking,
    getTrainerBookingById,
    getBookingsByUserId,
    getBookingsByTrainerId,
    getBookingsByTimeSlotId,
    updateTrainerBooking,
    deleteTrainerBooking
} = require("../controllers/trainerBookingsC");

const router = express.Router();

router.post("/", createTrainerBooking);
router.get("/:id", getTrainerBookingById);
router.get("/user/:userId", getBookingsByUserId);
router.get("/trainer/:trainerId", getBookingsByTrainerId);
router.get("/timeslot/:timeSlotId", getBookingsByTimeSlotId);
router.put("/:id", updateTrainerBooking);
router.delete("/:id", deleteTrainerBooking);

module.exports = router;
