const Order = require("../model/order");
const Product = require("../model/Product");
const User = require("../model/User");
const Address = require("../model/address");
const { mailSend } = require("../utility/mailSender");
const { adminOrderNotificationEmail } = require("../mailTemplate/AdminNotifcation"); 
const { userOrderConfirmationEmail } = require("../mailTemplate/PaymentSuccess");

// Admin email address
const ADMIN_EMAIL = "giftyshop78@gmail.com";

exports.createOrder = async (oderDetails) => {
  try {
    const {
      userId,
      productId,
      addressId,
      paymentId,
      orderId,
      deliveryCharge
    } = oderDetails;

    // Validate required fields
    if (!userId || !productId || !addressId || !paymentId || !orderId) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Fetch Product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const totalAmount = product.price;

    // Fetch User
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Fetch Address
    const address = await Address.findById(addressId);
    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    // Create Order
    const newOrder = await Order.create({
      userId,
      productId,
      addressId,
      paymentId,
      orderId,
      totalAmount,
      deliveryCharge
    });

    // Send confirmation email to user
    await mailSend(
      user.email,
      "Order Confirmation - Gifty Shop",
      userOrderConfirmationEmail(
        user.firstName,
        orderId,
        address,
        `https://gifty-shop.vercel.app/orders/${newOrder._id}`
      )
    );

    // Send notification email to admin
    await mailSend(
      ADMIN_EMAIL,
      "New Order Received",
      adminOrderNotificationEmail(
        orderId,
        user.firstName,
        user.email,
        product.productName,
        address
      )
    );

    return {
      success: true,
      message: "Order created successfully",
      order: newOrder,
    };

  } catch (error) {
    console.error("Error creating order:", error);
    return {
      success: false,
      message: "Internal server error",
    };
  }
};

exports.getOrders = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    
    const orders = await Order.find({ userId })
      .populate("productId", "productName mainImage price")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      orders,
    });

  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.getSingleOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    // Validate orderId
    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    // Find order and populate related data
    const order = await Order.findById(orderId)
      .populate("productId")
      .populate("userId", "firstName lastName email phoneNumber") 
      .populate("addressId");

    // If order doesn't exist
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order fetched successfully",
      order,
    });
  } catch (error) {
    console.error("Error fetching single order:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Update the status of a specific order
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    if (!orderId || !status) {
      return res.status(400).json({
        success: false,
        message: "Missing orderId or status",
      });
    }

    const allowedStatuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order: updatedOrder,
    });

  } catch (error) {
    console.error("Error updating order status:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};





