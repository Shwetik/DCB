// Import necessary packages and modules
const express = require('express');
const router = express.Router();
const { Cart, MyCart } = require("../db");
const axios = require('axios');


// Create a new cart item
/*
{
  "cartItem": [
    {
      "cuisine": "Indian",
      "dish": "Curry"
    }
  ]
}
*/
 
router.post('/', async (req, res) => {
    try {
      const newItem = await MyCart.create(req.body);
      res.status(201).json(newItem);
    } catch (error) {
      console.error("Error adding item to cart:", error);
      res.status(500).json({ error: 'Failed to add item to cart' });
    }
  });
  
  // Get all cart items
  router.get('/', async (req, res) => {
    try {
      const cartItems = await MyCart.find();
      res.json(cartItems);
    } catch (error) {
      console.error("Error retrieving cart items:", error);
      res.status(500).json({ error: 'Failed to retrieve cart items' });
    }
  });
  
  // Update a cart item
  /*
{
  "cartItem": {
    "cuisine": "Italian",
    "dish": "Pizza"
  }
}

*/
  router.put('/', async (req, res) => {
    try {
      const existingCartItems = await MyCart.find();
      if (existingCartItems.length > 0) {
        const firstCartItem = existingCartItems[0];
        firstCartItem.cartItem.push(req.body.cartItem); // Append new cart item
        await firstCartItem.save();
        res.json(firstCartItem);
      } else {
        const newCartItem = new MyCart({ cartItem: [req.body.cartItem] });
        await newCartItem.save();
        res.json(newCartItem);
      }
    } catch (error) {
      console.error("Error updating cart item:", error);
      res.status(500).json({ error: 'Failed to update cart item' });
    }
  });
  
  // Delete a cart item
  /*
{
  "cuisine": "Indian",
  "dish": "Curry"
}
*/
  router.delete('/', async (req, res) => {
    try {
      const cartItem = await MyCart.findOne({ "cartItem.cuisine": req.body.cuisine, "cartItem.dish": req.body.dish });
      if (!cartItem) {
        return res.status(404).json({ error: 'Cart item not found' });
      }
      cartItem.cartItem = cartItem.cartItem.filter(item => item.cuisine !== req.body.cuisine || item.dish !== req.body.dish);
      await cartItem.save();
      res.json({ message: 'Cart item updated successfully' });
    } catch (error) {
      console.error("Error deleting cart item:", error);
      res.status(500).json({ error: 'Failed to delete cart item' });
    }
  });
  
/*
// POST
router.post('/', async (req, res) => {
  try {
    const newItem = await MyCart.create(req.body);
    res.status(201).json(newItem);
  } catch (error) {
    console.error("Error adding item to cart:", error);
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
});

// GET
router.get('/', async (req, res) => {
  try {
    const cartItems = await MyCart.find();
    res.json(cartItems);
  } catch (error) {
    console.error("Error retrieving cart items:", error);
    res.status(500).json({ error: 'Failed to retrieve cart items' });
  }
});


// PUT 
router.put('/', async (req, res) => {
    try {
      // Check if there are any existing cart items
      const existingCartItems = await MyCart.find();
      
      if (existingCartItems.length > 0) {
        // If there are existing cart items, update the cuisine and dish inputs
        const firstCartItem = existingCartItems[0];
        firstCartItem.cartItem.push({ cuisine: req.body.cuisine, dish: req.body.dish });
        await firstCartItem.save(); // Save the updated cart item
        res.json(firstCartItem); // Return the updated cart item in response
      } else {
        // If there are no existing cart items, create a new one with the given inputs
        const newCartItem = new MyCart({
          cartItem: [{ cuisine: req.body.cuisine, dish: req.body.dish }]
        });
        console.log(newCartItem)
        await newCartItem.save(); // Save the new cart item
        res.json(newCartItem); // Return the newly created cart item in response
      }
    } catch (error) {
      console.error("Error updating or creating cart item:", error);
      res.status(500).json({ error: 'Failed to update or create cart item' });
    }
  });
  
  

// DELETE

router.delete('/', async (req, res) => {
    try {
      // Find the cart item that matches the provided cuisine and dish
      const cartItem = await MyCart.findOne({ cuisine: req.body.cuisine, dish: req.body.dish });
      console.log(cartItem)
  
      if (!cartItem) {
        return res.status(404).json({ error: 'Cart item not found' });
      }
  
      // Remove the provided cuisine and dish from the arrays
      cartItem.cuisine.splice(cartItem.cuisine.indexOf(req.body.cuisine), 1);

      cartItem.dish = cartItem.dish.filter(item => item !== req.body.dish);
  
      // Save the updated cart item
      await cartItem.save();
  
      res.json({ message: 'Cart item updated successfully' });
    } catch (error) {
      console.error("Error updating cart item:", error);
      res.status(500).json({ error: 'Failed to update cart item' });
    }
  });
*/
  
  


  

module.exports = router;
