const stripe = require('stripe')('sk_test_51QIa6CI8FUx9qxcaZEdV6RDm1uLsu0WOVILRlhTjI0bl0mikU1URfyzcAQ8nrfYEs5YLFxYBR0GBxkwyuHqDSmh300cbVyVJnL');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();

app.use(bodyParser.json()); 

app.get('/', (req, res) => {
    res.send("Hello Folks...!!! please subscribe my channel")
  })

  app.post('/create-customer', async (req, res) => {
    try {
      const { name, email } = req.body;
      // Create a customer in Stripe
      const customer = await stripe.customers.create({
        name: name,
        email: email,
      });
      if (!customer || !customer.id) {
        throw new Error("Failed to create Stripe customer or missing customer ID");
      }
      // Send the customer object (including ID) in the response
      res.status(200).json(customer);
    } catch (error) {
      // Log the error for debugging
      console.error('Error creating customer:', error.message);
      // Send a 400 Bad Request response with an error message
      res.status(400).json({ success: false, error: error.message });
    }
  });
  
  // Route to add new card
  app.post('/add-newCard', async (req, res) => {
    try {
      const {
        customer_id,
        token,
      } = req.body;
  
      // Use the token to add the card to Stripe customer
      const card = await stripe.customers.createSource(customer_id, {
        source: token,
      });
  
      res.status(200).send({ card: card.id });
    } catch (error) {
      console.error('Error adding new card:', error);
      res.status(400).send({ success: false, msg: error.message });
    }
  });
  
  // create Charges
  app.post('/create-charges', async (req, res) => {
    try {
      const { customer_id, card_id, amount } = req.body;
  
      // Create a charge using the customer_id and card_id
      const createChargeResponse = await stripe.charges.create({
        amount: amount * 100, // Amount in cents
        currency: "USD",
        customer: customer_id,
        card: card_id,
        // Additional parameters as needed
      });
  
      res.status(200).send(createChargeResponse);
    } catch (error) {
      console.error("Error creating charge:", error.message);
      res.status(400).send({ success: false, msg: error.message });
    }
  });
  
  app.post('/paymentMethods_get', async (req, res) => {
    try {
      const { customer } = req.body;
      console.log("Received customer ID:", customer);
  
      if (!customer) {
        throw new Error('Customer ID is required');
      }
  
      // Fetch payment methods of type 'card' for the specified customer
      const paymentMethods = await stripe.paymentMethods.list({
        customer: customer,
        type: 'card',
      });
  
      console.log("Payment methods fetched:", paymentMethods);
  
      // Respond with the payment methods
      res.json(paymentMethods);
    } catch (error) {
      console.error('Error fetching payment methods:', error.message);
      res.status(500).json({ error: 'Failed to fetch payment methods' });
    }
  });



  app.listen(4002, () => console.log("Running on http://localhost:4002"))