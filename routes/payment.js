const express = require("express");
const router = express.Router();

const {capturePayment, verifyPayment, } = require("../controllers/payment");


router.post("/capturePayment",capturePayment);

router.post("/verifyPayment",verifyPayment);

module.exports = router;
