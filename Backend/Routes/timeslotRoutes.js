const express = require("express");
const router = express.Router();

const {
    createTimeSlot,
    getAllTimeSlots,
    getTimeSlotById,
    updateTimeSlot,
    deleteTimeSlot
} = require("../controllers/timeslotController");

// Create new timeslot
router.post("/", createTimeSlot);

// Get all timeslots
router.get("/", getAllTimeSlots);

// Get, update, and delete by ID
router.get("/:id", getTimeSlotById);
router.put("/:id", updateTimeSlot);
router.delete("/:id", deleteTimeSlot);

module.exports = router;
