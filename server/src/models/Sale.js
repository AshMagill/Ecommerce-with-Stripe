const mongoose = require("mongoose");

const SaleSchema = new mongoose.Schema({
  id: String,
  object: String,
  amount_discount: Number,
  amount_subtotal: Number,
  amount_tax: Number,
  amount_total: Number,
  currency: String,
  description: String,
  quantity: Number,
  createdAt: {
    type: Date,
    default: Date.now, // Set default value to the current date and time
  },
});

const Sale = mongoose.model("Sale", SaleSchema);

module.exports = Sale;
