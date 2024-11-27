const express = require('express');
const router = express.Router();
const Item = require('../model/item'); // Import the Item model

// Display User's Inventory
router.get('/', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/users/login');
  }

  try {
    // Fetch inventory items belonging to the logged-in user
    const items = await Item.find({ user_id: req.user.id });
    res.render('Inventory/list', {
      title: 'Your Warehouse Inventory',
      ItemList: items,
    });
  } catch (err) {
    console.error(err);
    res.render('Inventory/list', {
      title: 'Your Warehouse Inventory',
      ItemList: [],
      error: 'Error fetching your inventory',
    });
  }
});

// Add New Inventory Item
router.post('/add', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/users/login');
  }

  try {
    // Create a new inventory item associated with the logged-in user
    const newItem = new Item({
      ItemName: req.body.ItemName,
      Supplier: req.body.Supplier,
      DateReceived: req.body.DateReceived,
      ItemDescription: req.body.ItemDescription,
      Cost: req.body.Cost,
      Quantity: req.body.Quantity,
      user_id: req.user.id, // Associate the item with the logged-in user
    });

    await newItem.save();
    res.redirect('/inventory'); // Redirect back to the inventory page
  } catch (err) {
    console.error(err);
    res.redirect('/inventory');
  }
});

// Other routes (Edit, Delete) can also be updated similarly to handle user-specific actions