//const { Collection, default: mongoose } = require("mongoose");

const mongoose = require("mongoose");

let inventoryModel = mongoose.Schema({
    ItemName: String,
    Supplier: String,
    DateReceived: Date,
    ItemDescription: String,
    Cost: Number,
    Quantity: Number
},
{
    collection: "Warehouse_Inventory"
});
module.exports = mongoose.model('Item', inventoryModel);

