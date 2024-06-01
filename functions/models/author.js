const mongoose = require('mongoose');
const inventorySchema = require('../schema/author'); 

const InventoryModel = mongoose.model('Inventory', inventorySchema);

module.exports = InventoryModel; 
