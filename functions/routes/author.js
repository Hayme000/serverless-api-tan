const express = require('express');
const InventoryItemModel = require('../models/author');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const inventoryItems = await InventoryItemModel.find(); 
        res.json(inventoryItems); 
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/:id', getInventoryItem, (req, res) => {
    res.json(res.inventoryItem);
});


router.post('/', async (req, res) => {
    try {
        const { name, quantity, reorderPoint } = req.body;
        if (!name || !quantity || !reorderPoint) {
            return res.status(400).json({ message: 'Name, quantity, and reorder point are required' });
        }
        
        const existingItem = await InventoryItemModel.findOne({ name });
        if (existingItem) {
            return res.status(400).json({ message: 'Item already exists' });
        }
        
        const newItem = new InventoryItemModel({ name, quantity, reorderPoint }); // Updated model name
        const savedItem = await newItem.save();
        res.status(201).json({ message: 'Item created successfully', item: savedItem });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update an existing inventory item
router.put('/:id', getInventoryItem, async (req, res) => {
    try {
        const updatedItem = await InventoryItemModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedItem);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete an inventory item
router.delete('/:id', getInventoryItem, async (req, res) => {
    try {
        await res.inventoryItem.deleteOne();
        res.json({ message: 'Item deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Middleware function to get a single inventory item by ID
async function getInventoryItem(req, res, next) {
    try {
        const inventoryItem = await InventoryItemModel.findById(req.params.id); // Updated model name
        if (!inventoryItem) {
            return res.status(404).json({ message: 'Inventory item not found' });
        }
        res.inventoryItem = inventoryItem;
        next();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

module.exports = router;
