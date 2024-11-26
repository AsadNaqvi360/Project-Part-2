var express = require('express');
var router = express.Router();
let mongoose = require('mongoose');
let Item = require('../model/item'); // Updated model import to 'item'
const { ensureAuthenticated } = require('../middlewares/auth'); // Import authentication middleware

/* Read Operation: Get route for displaying the inventory list */
router.get('/', ensureAuthenticated, async (req, res, next) => {
    try {
        const ItemList = await Item.find();
        res.render('Inventory/list', {
            title: 'Inventory',
            ItemList: ItemList
        });
    } catch (err) {
        console.error(err);
        res.render('Inventory/list', {
            error: 'Error retrieving inventory data'
        });
    }
});

/* Create Operation: Display the Add Item Page */
router.get('/add', ensureAuthenticated, async (req, res, next) => {
    try {
        res.render('Inventory/add', {
            title: 'Add Item'
        });
    } catch (err) {
        console.error(err);
        res.render('Inventory/list', {
            error: 'Error on the server'
        });
    }
});

/* Create Operation: Process the Add Item */
router.post('/add', ensureAuthenticated, async (req, res, next) => {
    try {
        let newItem = new Item({
            "ItemName": req.body.ItemName,
            "Supplier": req.body.Supplier,
            "DateReceived": req.body.DateReceived,
            "ItemDescription": req.body.ItemDescription,
            "Cost": req.body.Cost,
            "Quantity": req.body.Quantity
        });
        await newItem.save();
        res.redirect('/inventory');
    } catch (err) {
        console.error(err);
        res.render('Inventory/list', {
            error: 'Error saving new item'
        });
    }
});

/* Update Operation: Display Edit Item Page */
router.get('/edit/:id', ensureAuthenticated, async (req, res, next) => {
    try {
        const id = req.params.id;
        const itemToEdit = await Item.findById(id);
        res.render('Inventory/edit', {
            title: 'Edit Item',
            Item: itemToEdit
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

/* Update Operation: Process the Edit Item */
router.post('/edit/:id', ensureAuthenticated, async (req, res, next) => {
    try {
        const id = req.params.id;
        const updatedItem = {
            "ItemName": req.body.ItemName,
            "Supplier": req.body.Supplier,
            "DateReceived": req.body.DateReceived,
            "ItemDescription": req.body.ItemDescription,
            "Cost": req.body.Cost,
            "Quantity": req.body.Quantity
        };
        await Item.findByIdAndUpdate(id, updatedItem);
        res.redirect('/inventory');
    } catch (err) {
        console.error(err);
        res.render('Inventory/list', {
            error: 'Error updating item'
        });
    }
});

/* Delete Operation */
router.get('/delete/:id', ensureAuthenticated, async (req, res, next) => {
    try {
        const id = req.params.id;
        await Item.findByIdAndDelete(id);
        res.redirect('/inventory');
    } catch (err) {
        console.error(err);
        res.render('Inventory/list', {
            error: 'Error deleting item'
        });
    }
});

module.exports = router;
