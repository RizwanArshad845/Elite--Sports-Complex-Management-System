const express = require("express");
const { createTrainer, getTrainerById, getTrainerByName, updateTrainer, deleteTrainer, getAllTrainers } = require("../controllers/trainerC");

const router = express.Router();

router.post("/", createTrainer);
router.get("/", getAllTrainers);
router.get("/:id", getTrainerById);
router.get("/name/:name", getTrainerByName);
router.put("/:id", updateTrainer);
router.delete("/:id", deleteTrainer);

module.exports = router;
