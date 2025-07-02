exports.adminOrderNotificationEmail = (orderId, userName, userEmail, productName, address) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
  <meta charset="UTF-8" />
  <title>New Order Received</title>
  <style>
    body {
      background-color: #fff;
      font-family: Arial, sans-serif;
      font-size: 16px;
      color: #333;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      text-align: left;
    }
    .header {
      font-size: 22px;
      font-weight: bold;
      color: #2196F3;
      margin-bottom: 20px;
      text-align: center;
    }
    .body {
      font-size: 16px;
      margin-bottom: 20px;
    }
    .details {
      background-color: #f2f2f2;
      padding: 15px;
      border-radius: 6px;
      margin-bottom: 20px;
    }
    .details p {
      margin: 6px 0;
    }
    .support {
      font-size: 14px;
      color: #666;
      text-align: center;
    }
  </style>
  </head>
  <body>
    <div class="container">
      <div class="header">New Order Received</div>
      <div class="body">
        <p>You have received a new order:</p>
        <div class="details">
          <p><strong>Order ID:</strong> ${orderId}</p>
          <p><strong>Customer Name:</strong> ${userName}</p>
          <p><strong>Customer Email:</strong> ${userEmail}</p>
          <p><strong>Product:</strong> ${productName}</p>
          <p><strong>Delivery Address:</strong><br />
            ${address.address},<br />
            ${address.locality},<br />
            ${address.city}, ${address.state} - ${address.pincode}<br />
            Phone: ${address.phoneNumber}
          </p>
        </div>
      </div>
      <div class="support">
        For any questions, contact support at
        <a href="mailto:giftyshop78@gmail.com">giftyshop78@gmail.com</a>.
      </div>
    </div>
  </body>
  </html>`;
};
