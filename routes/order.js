// backend/routes/user.js
const express = require('express');

const router = express.Router();
const zod = require("zod");
const { Order } = require("../db");




// Route to create a new order
router.post('/', async (req, res) => {
    try {
      // Create a new order using request body
      const order = await Order.create(req.body);
      res.status(201).json(order); // Return created order
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  

// Route to get all orders
router.get('/', async (req, res) => {
    try {
      // Fetch all orders from the database
      const orders = await Order.find();
      res.status(200).json(orders); // Return all orders
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });


// Route to update an existing order
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      // Update the order with the given id
      const updatedOrder = await Order.findByIdAndUpdate(id, req.body, { new: true });
      res.status(200).json(updatedOrder); // Return updated order
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  // Route to delete an existing order
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      // Delete the order with the given id
      await Order.findByIdAndDelete(id);
      res.status(204).end(); // No content response
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });




module.exports = router;