const express = require("express");
const { 
    createMembership, 
    getMembershipById, 
    getMembershipByUserId, 
    getMembershipByTypeId, 
    getMembershipByPaymentStatus, 
    updateMembership, 
    deleteMembership 
} = require("../controllers/membershipC");

const router = express.Router();

router.post("/", createMembership);  // Create Membership
router.get("/:id", getMembershipById);  // Get Membership by ID
router.get("/user/:userId", getMembershipByUserId);  // Get Membership by User ID
router.get("/type/:typeId", getMembershipByTypeId);  // Get Membership by Type ID
router.get("/status/:statusId", getMembershipByPaymentStatus);  // Get Membership by Payment Status ID
router.put("/:id", updateMembership);  // Update Membership by ID
router.delete("/:id", deleteMembership);  // Delete Membership by ID

module.exports = router;
