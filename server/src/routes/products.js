const express = require("express");
const router = express.Router();
const Stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Get all products with price details
router.get("/", async (req, res, next) => {
  try {
    const response1 = await Stripe.products.list({
      limit: 100,
    });
    const products = response1.data;
    const response2 = await Stripe.prices.list({
      limit: 100,
    });
    const prices = response2.data;

    const productsWithPrices = products.map((item, index) => {
      return {
        ...item,
        price: prices[index].unit_amount,
        currency: prices[index].currency,
      };
    });
    activeProducts = productsWithPrices.filter((item) => item.active);
    res.status(200).json(activeProducts);
  } catch (error) {
    next(error);
  }
});

router.post("/create-checkout-session", async (req, res) => {
  const lineItems = req.body.line_items;
  const deliveryMethod = req.body.delivery_method;
  //if delivery_method from client is deliver, an address is asked for
  try {
    if (deliveryMethod == "deliver") {
      const session = await Stripe.checkout.sessions.create({
        line_items: lineItems,
        mode: "payment",
        success_url: `${process.env.CLIENT_DOMAIN}/cart?successful=true`,
        cancel_url: `${process.env.CLIENT_DOMAIN}/cart?cancelled=true`,
        shipping_address_collection: {
          allowed_countries: ["NZ"],
        },
      });
      res.json({ url: session.url });
    } else {
      //no  address is asked for
      const session = await Stripe.checkout.sessions.create({
        line_items: lineItems,
        mode: "payment",
        success_url: `${process.env.CLIENT_DOMAIN}/cart?successful=true`,
        cancel_url: `${process.env.CLIENT_DOMAIN}/cart?cancelled=true`,
      });
      res.json({ url: session.url });
    }
  } catch (error) {
    res.json({ url: `${process.env.CLIENT_DOMAIN}/cancel` });
    console.log({ "Error : ": error.message });
  }
});

module.exports = router;
