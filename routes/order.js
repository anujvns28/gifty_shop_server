const express = require("express");
const router = express.Router();
const {
  createOrder,
  updateOrderStatus,
  getOrders,
  getSingleOrder,
  getAllOrdersForAdmin,
  updateOrderStatusForAdmin,
} = require("../controllers/order");

router.post("/create-order", createOrder);
router.post("/status", updateOrderStatus);
router.post("/fetch-orders", getOrders);
router.post("/fetch-ordersDetails", getSingleOrder);
router.get("/all-ordersForAdmin", getAllOrdersForAdmin);
router.post("/update-order-status", updateOrderStatusForAdmin);


module.exports = router;
