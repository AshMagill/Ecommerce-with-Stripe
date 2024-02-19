const express = require("express");
const router = express.Router();
const Stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Sale = require("../models/Sale");

// Get all sales
router.get("/DB", async (req, res, next) => {
  try {
    const sales = await Sale.find();
    res.status(200).json(sales);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
