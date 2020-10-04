
const stripe = require('stripe')('sk_test_51HYGavHKsgknvL1FpDi0LTXLiBtCy9SDBv5Emnzf34ATaBAzFnUN6jV7HQaFgHX7M6yiWKgZnQedS2Kip1x18TVS009ZG5fNbR');
const express = require('express');
const app = express();

app.use(express.static('.'));
app.use(express.urlencoded({extended: true})); 
app.use(express.json());   

const YOUR_DOMAIN = 'http://localhost:4242';

/*   A POST is executed when the user hits the "checkout" button on the front end */
app.post('/create-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
       price: 'price_1HYLQSHKsgknvL1FO7B8vhDs', // Created a product and price on the Stripe Dashboard
       quantity: req.body.quantity,             // that I grab here. Quantity comes from the front end
      },
    ],
    mode: 'payment',
    success_url: `${YOUR_DOMAIN}/success.html`,
    cancel_url: `${YOUR_DOMAIN}/cancel.html`,
  });

  res.json({ id: session.id});
});

/*   A GET call is made on the success page to grab the charge ID from the session */
app.get('/get-charge', async (req, res) => {
  var sessionId = req.query.sessionId;
  const session = await stripe.checkout.sessions.retrieve(
      sessionId
    );
  const payment_intent = await stripe.paymentIntents.retrieve(
    session.payment_intent
  );
  const charge_id = payment_intent.charges.data[0].id;
  res.json({charge_id: charge_id});
});

app.listen(4242, () => console.log('Running on port 4242'));