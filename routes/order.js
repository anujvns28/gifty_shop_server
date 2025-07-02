const express = require("express");
const router = express.Router();
const { createOrder, updateOrderStatus, getOrders, getSingleOrder } = require("../controllers/order");

router.post("/create-order", createOrder);
router.post("/status", updateOrderStatus); 
router.post('/fetch-orders', getOrders);
router.post('/fetch-ordersDetails', getSingleOrder);


module.exports = router;
