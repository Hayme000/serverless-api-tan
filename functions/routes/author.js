const express = require('express');
const InventoryItemModel = require('../models/author');
const router = express.Router();

// Get all inventory items
router.get('/', async (req, res) => {
    try {
        const inventoryItems = await InventoryItemModel.find();
        res.json(inventoryItems);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a single inventory item by ID
router.get('/:id', getInventoryItem, (req, res) => {
    res.json(res.inventoryItem);
});

// Create a new inventory item
router.post('/', async (req, res) => {
    const { name, quantity, reorderPoint, price, brand, manufacturer } = req.body;

    // Validate required fields
    if (!name || !quantity || !reorderPoint || !price || !brand || !manufacturer) {
        return res.status(400).json({ message: 'Name, quantity, reorder point, price, brand, and manufacturer are required' });
    }

    try {
        // Check if the item already exists
        const existingItem = await InventoryItemModel.findOne({ name });
        if (existingItem) {
            return res.status(400).json({ message: 'Item already exists' });
        }

        // Create a new item
        const newItem = new InventoryItemModel({ name, quantity, reorderPoint, price, brand, manufacturer });
        const savedItem = await newItem.save();
        res.status(201).json({ message: 'Item created successfully', item: savedItem });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update an existing inventory item
router.put('/:id', getInventoryItem, async (req, res) => {
    const { name, quantity, reorderPoint, price, brand, manufacturer } = req.body;

    // Validate required fields
    if (!name || !quantity || !reorderPoint || !price || !brand || !manufacturer) {
        return res.status(400).json({ message: 'Name, quantity, reorder point, price, brand, and manufacturer are required' });
    }

    try {
        // Update the item
        res.inventoryItem.name = name;
        res.inventoryItem.quantity = quantity;
        res.inventoryItem.reorderPoint = reorderPoint;
        res.inventoryItem.price = price;
        res.inventoryItem.brand = brand;
        res.inventoryItem.manufacturer = manufacturer;

        const updatedItem = await res.inventoryItem.save();
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
        const inventoryItem = await InventoryItemModel.findById(req.params.id);
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
