const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
require('dotenv').config();

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const PLAN_PRICE_IDS = {
  pro: 'prod_SjtCx1tLfyY7hl'
};

router.post('/api/checkout/:plan', async (req, res) => {
  const plan = req.params.plan;
  const priceId = PLAN_PRICE_IDS[plan];

  if (!priceId) {
    return res.status(400).json({ error: 'Invalid plan selected' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [{
        price: priceId,
        quantity: 1
      }],
      success_url: 'https://xmarkai.com?checkout=success',
      cancel_url: 'https://xmarkai.com?checkout=cancel',
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Stripe session error:', error);
    res.status(500).json({ error: 'Failed to create Stripe checkout session' });
  }
});

module.exports = router;
