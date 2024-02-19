const mongoose = require("mongoose");

const port = process.env.API_PORT || 5001;
const app = require("./app");
dotenv = require("dotenv");
dotenv.config();

app.listen(port, () => {
  console.log(`API server listening on ${port}`);
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Database connection error:", err.message);
  });
