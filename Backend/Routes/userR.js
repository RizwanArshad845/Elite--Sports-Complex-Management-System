const express = require("express");
const {
    createUser, registerUserWithMembership, getAllUsers, getUserById, getUserByUsername,
    updateUser, deleteUser, getTrainersForUser, getFacilitiesForUser,
    getFeedbackForUser, getPaymentsForUser, getMembershipForUser, loginUser
} = require("../controllers/userC");

const router = express.Router();
const authenticateToken = require("../middleware/auth");

router.post("/register", registerUserWithMembership); // ✅ MUST BE BEFORE "/:id"
router.post("/", createUser);
router.post("/login", loginUser);
router.get("/", getAllUsers);
router.get("/username/:username", getUserByUsername);

router.get("/:id/trainers", getTrainersForUser);
router.get("/:id/facilities", getFacilitiesForUser);
router.get("/:id/feedback", getFeedbackForUser);
router.get("/:id/payments", getPaymentsForUser);
router.get("/:id/membership", getMembershipForUser);

router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
