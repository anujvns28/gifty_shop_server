const express = require('express');
const { dbConnection } = require('./config/database');
const app = express();
const cors = require("cors");
const fileUpload = require('express-fileupload')
require("dotenv").config()



const authRoutes = require("./routes/atuh")
const categoriesRoutes = require("./routes/categories");
const subCategoriesRoutes = require("./routes/subCategories");
const productRoutes = require("./routes/product");
const paymentRoutes = require("./routes/payment");
const { cloudinaryConnect } = require('./config/cloudenary');
const { default: axios } = require('axios');



const port = process.env.PORT || 4000;

// database connection
dbConnection();

//  createShouse();

//cloudenry connection
cloudinaryConnect();

//middleware
app.use(express.json());

app.use(
	cors({
		origin: "*",
		credentials: true,
	})
);

app.use(
	fileUpload({
		useTempFiles: true,
		tempFileDir: "/tmp/",
	})
);
//mounting
app.use("/api/v1/auth",authRoutes)
app.use("/api/v1/category",categoriesRoutes)
app.use("/api/v1/subCategory",subCategoriesRoutes)
app.use("/api/v1/product",productRoutes)
app.use("/api/v1/payment",paymentRoutes)

// Add keep-alive endpoint
app.get('/keep-alive', (req, res) => {
	res.status(200).send('Server is alive');
  });


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});


// Keep-alive function
const keepWarm = () => {
	const interval = process.env.WARM_UP_INTERVAL || 5 * 60 * 1000; // default to 1 minute
	const keepAliveUrl = `https://gifty-shop-server.onrender.com/keep-alive`;
  
	setInterval(async () => {
	  try {
		console.log('Sending keep-alive request');
		const response = await axios.get(keepAliveUrl);
		console.log(`Keep-alive request status: ${response.status}`);
	  } catch (error) {
		console.error('Error sending keep-alive request:', error);
	  }
	}, interval);
  };
  
  keepWarm();
