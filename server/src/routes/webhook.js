const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Sale = require("../models/Sale");
const bodyParser = require("body-parser");

const fulfillOrder = async (lineItems) => {
  const sale = await Sale.insertMany(lineItems.data);
};
// Use Stripe CLI to test webhooks
const endpointSecret = process.env.STRIPE_WEBHOOK_KEY;

router.post(
  "/",
  express.raw({ type: "application/json" }),
  async (request, response) => {
    try {
      const payload = request.body;
      const sig = request.headers["stripe-signature"];

      let event;

      try {
        event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
      } catch (err) {
        console.log(err.message);
        return response.status(400).send(`Webhook Error: ${err.message}`);
      }
      if (event.type === "checkout.session.completed") {
        // Retrieve the session. If you require line items in the response, you may include them by expanding line_items.
        const sessionWithLineItems = await stripe.checkout.sessions.retrieve(
          event.data.object.id,
          {
            expand: ["line_items"],
          }
        );
        const lineItems = sessionWithLineItems.line_items;
        console.log("event.data :", event.data);

        // Fulfill the purchase... or just store it in the database
        fulfillOrder(lineItems);
      }
      response.status(200).end();
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
