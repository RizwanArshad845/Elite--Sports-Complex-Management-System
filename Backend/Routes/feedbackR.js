const express = require("express");
const {
    createFeedback,
    getAllFeedbacks,
    updateFeedback,
    deleteFeedback,
    getFeedbacksByUserId
} = require("../controllers/feedbackC");

const router = express.Router();

// Create a new feedback
router.post("/", createFeedback);

// Get all feedbacks
router.get("/", getAllFeedbacks);

// Update feedback by ID
router.put("/:id", updateFeedback);

// Delete feedback by ID
router.delete("/:id", deleteFeedback);

// Get feedbacks by UserID
router.get("/user/:userId", getFeedbacksByUserId);

module.exports = router;
