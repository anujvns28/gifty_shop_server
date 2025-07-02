exports.userOrderConfirmationEmail = (name, orderId, address, link) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
  <meta charset="UTF-8" />
  <title>Order Confirmation</title>
  <style>
    body {
      background-color: #ffffff;
      font-family: Arial, sans-serif;
      font-size: 16px;
      color: #333333;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      text-align: center;
    }
    .logo {
      max-width: 200px;
      margin-bottom: 20px;
    }
    .message {
      font-size: 22px;
      font-weight: bold;
      margin-bottom: 10px;
      color: #4CAF50;
    }
    .body {
      font-size: 16px;
      margin-bottom: 20px;
    }
    .cta {
      display: inline-block;
      padding: 12px 25px;
      background-color: #FFD60A;
      color: #000;
      text-decoration: none;
      border-radius: 5px;
      font-weight: bold;
      margin-top: 15px;
    }
    .support {
      font-size: 14px;
      color: #999999;
      margin-top: 25px;
    }
  </style>
  </head>
  <body>
    <div class="container">
      <div class="message">Order Confirmed! 🎉</div>
      <div class="body">
        <p>Dear ${name},</p>
        <p>Thank you for your order. Your order ID is <strong>${orderId}</strong>.</p>
        <p>We will deliver your product to the following address:</p>
        <p>
          ${address.address},<br />
          ${address.locality},<br />
          ${address.city}, ${address.state} - ${address.pincode}<br />
          Phone: ${address.phoneNumber}
        </p>
        <a class="cta" href="${link}">View Your Order</a>
      </div>
      <div class="support">
        If you have any questions, feel free to contact us at
        <a href="mailto:giftyshop78@gmail.com">giftyshop78@gmail.com</a>.
      </div>
    </div>
  </body>
  </html>`;
};
