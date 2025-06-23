const Razorpay = require("razorpay");
require("dotenv").config();

exports.instance = new Razorpay({
    key_id: process.env.REZORPAY_ID,
    key_secret: process.env.REZORPAY_SECRET,
  });