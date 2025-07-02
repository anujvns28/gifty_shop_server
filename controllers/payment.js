const { instance } = require("../config/razorpay");
const Product = require("../model/Product");
require("dotenv").config();

const crypto = require("crypto");
const { mailSend } = require("../utility/mailSender");
const { createOrder } = require("./order");

//initiate the razorpay order
exports.capturePayment = async (req, res) => {
  const { shouses, deliveryCharge } = req.body;

  if (shouses.length === 0) {
    return res.json({
      success: false,
      message: "Please provide shouse Id",
    });
  }

  let totalAmount = 0;

  for (const shouse_id of shouses) {
    let shouse;
    try {
      shouse = await Product.findById(shouse_id);
      if (!shouse) {
        return res.status(200).json({
          success: false,
          message: "Could not find the shouse",
        });
      }

      totalAmount += shouse.price;
    } catch (error) {
      console.log(error, "eror occuring");
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  totalAmount += deliveryCharge; // Adding delivery charge to the total amount

  const currency = "INR";
  const options = {
    amount: totalAmount * 100,
    currency,
    receipt: Math.random(Date.now()).toString(),
  };

  try {
    const paymentResponse = await instance.orders.create(options);
    console.log(paymentResponse, "this is payment response");
    res.json({
      success: true,
      message: paymentResponse,
    });
  } catch (error) {
    console.log(error, "erroro occuring ji");
    return res.status(500).json({
      success: false,
      mesage: "Could not Irnitiate Orde",
    });
  }
};

//verify the payment
exports.verifyPayment = async (req, res) => {
  console.log(req.body, "veryfing me aapka svagat hai");
  const razorpay_order_id = req.body?.razorpay_order_id;
  const razorpay_payment_id = req.body?.razorpay_payment_id;
  const razorpay_signature = req.body?.razorpay_signature;
  const shouses = req.body?.shouses;
  const userId = req.body.userId;
  const addresId = req.body.addressId;
  const deliveryCharge = req.body.deliveryCharge;

  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature ||
    !shouses ||
    !userId
  ) {
    return res.status(200).json({
      success: false,
      message: "Payment Failed",
    });
  }

  let body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.REZORPAY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    if (razorpay_signature) {
      //create order
      const newOrder = {
        userId,
        productId: shouses,
        addressId: addresId,
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        deliveryCharge: deliveryCharge,
      };
      await createOrder(newOrder);
      //return res
      return res
        .status(200)
        .json({ success: true, message: "Payment Verified" });
    }
    return res.status(200).json({
      success: "false",
      message: "Payment Failed",
    });
  }
};
