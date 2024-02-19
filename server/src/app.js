// Import required modules
const express = require("express");
const cors = require("cors");
const productsRoutes = require("./routes/products");
const salesRoutes = require("./routes/sales");
const webhookRoutes = require("./routes/webhook");

// Create an Express app
const app = express();

// cors allowed urls are placed in the whitelist
const whitelist = [process.env.CLIENT_DOMAIN, "https://hooks.stripe.com"];
app.use(
  cors({
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        // Allow the request to proceed without an error
        callback(null, false);
      }
    },
  })
);

// console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
app.use("/webhook", webhookRoutes);

app.use(express.json());

// Set up routes
app.use("/api/products", productsRoutes);
app.use("/api/sales", salesRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send("Something went wrong");
});

// Export the app
module.exports = app;
