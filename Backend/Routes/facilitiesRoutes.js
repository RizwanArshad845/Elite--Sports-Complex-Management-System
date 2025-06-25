const express = require("express");
const {
    createFacility,
    getAllFacilities,
    getFacilityById,
    getFacilityByName,
    getFacilityByType,
    updateFacility,
    deleteFacility
} = require("../controllers/facilitiesController");

const router = express.Router();

// Create a new facility
router.post("/", createFacility);

// Get all facilities
router.get("/", getAllFacilities);

// Get facility by name
router.get("/name/:name", getFacilityByName);

// Get facility by type
router.get("/type/:type", getFacilityByType);

// Get facility by ID
router.get("/:id", getFacilityById);

// Update facility by ID
router.put("/:id", updateFacility);

// Delete facility by ID
router.delete("/:id", deleteFacility);

module.exports = router;
