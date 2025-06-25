const express = require("express");
const { 
    createMembershipType, 
    getMembershipTypeById, 
    getMembershipTypeByName, 
} = require("../controllers/membershipTypeC");

const router = express.Router();

router.post("/", createMembershipType);  // Create Membership Type
router.get("/:id", getMembershipTypeById);  // Get Membership Type by ID
router.get("/name/:typeName", getMembershipTypeByName);  // Get Membership Type by Name

module.exports = router;
