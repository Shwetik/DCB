// backend/routes/user.js
const express = require('express');

const router = express.Router();
const zod = require("zod");
const { Menu } = require("../db");
const { menuBody } = require('../types');



router.get("/menu/get", async (req, res) => {
    const filter = req.query.filter || "";

    const items = await Menu.find({ 
        $or: [{                                 // $or is an array which stores data which satisfy mentioned conditions inside $or
            cuisine: {
                "$regex": filter
            }
        }, {
            dish: {
                "$regex": filter
            }
        }]
    })

    
    res.json({
        menu: items.map(menu => ({          
            cuisine: menu.cuisine,
            dish: menu.dish,
            description: menu.description,
            dishImage: menu.dishImage,
            _id: menu._id
        }))
    })
})

router.get('/filter/get', async (req, res) => {
    try {
      const { cuisine } = req.query;
  
      // Convert the comma-separated string of cuisines into an array
      const selectedCuisines = cuisine.split(',');
  
      // Query the database to find menu items matching the selected cuisines
      const menuItems = await Menu.find({ cuisine: { $in: selectedCuisines } });
  
      // Respond with the fetched menu items
      res.json({ success: true, menu: menuItems });
    } catch (error) {
      // Handle errors
      console.error('Error fetching menu items:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  });


router.post("/addMenuItem", async (req, res) => {
    console.log(req.body)
 
    const existingItem = await Menu.findOne({
        cuisine: req.body.cuisine,
        dish: req.body.dish
    })

    console.log(existingItem)
    if (existingItem) {
        return res.status(411).json({
            message: "Cuisine/Dish already taken"
        })
    }

    const MenuItem = await Menu.create({
        cuisine: req.body.cuisine,
        dish: req.body.dish,
        description: req.body.description,
        dishImage: req.body.dishImage,
    })

    console.log(MenuItem)


    res.json({
        message: "Item created successfully",
    })
})

router.put('/update/:id', async (req, res) => {
    const { id } = req.params;
    const { Cuisine, Dish, Description, DishImage } = req.body;
    try {
        // Find the menu item by ID and update it
        const updatedMenuItem = await Menu.findByIdAndUpdate(id, { Cuisine, Dish, Description, DishImage }, { new: true });
        if (!updatedMenuItem) {
            return res.status(404).json({ error: 'Menu item not found' });
        }
        res.json(updatedMenuItem);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET request to fetch menu items with filtering based on cuisine
router.get('/api/menu', async (req, res) => {
    const { cuisine } = req.query;
    try {
        let menuItems;
        if (cuisine) {
            // If cuisine query parameter is provided, filter menu items by cuisine
            menuItems = await Menu.find({ Cuisine: cuisine });
        } else {
            // If no cuisine query parameter is provided, fetch all menu items
            menuItems = await Menu.find();
        }
        res.json(menuItems);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // Find the menu item by ID and delete it
        await Menu.findByIdAndDelete(id);
        res.status(204).send(); // No content response
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});






module.exports = router;
