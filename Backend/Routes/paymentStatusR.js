const express = require("express");
const {
    createPaymentStatus,
    getPaymentStatusById,
    getPaymentStatusByName,
} = require("../controllers/paymentStatusC");

const router = express.Router();

router.post("/", createPaymentStatus);
router.get("/:id", getPaymentStatusById);
router.get("/name/:name", getPaymentStatusByName);

module.exports = router;
