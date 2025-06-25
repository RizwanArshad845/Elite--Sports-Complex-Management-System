const express = require("express");
const { 
    createPayment, 
    getPaymentById, 
    getPaymentsByUserId, 
    getPaymentsByMethod, 
    updatePayment, 
    deletePayment 
} = require("../controllers/paymentC");

const router = express.Router();

router.post("/", createPayment);
router.get("/:id", getPaymentById);
router.get("/user/:userId", getPaymentsByUserId);
router.get("/method/:method", getPaymentsByMethod);
router.put("/:id", updatePayment);
router.delete("/:id", deletePayment);

module.exports = router;
