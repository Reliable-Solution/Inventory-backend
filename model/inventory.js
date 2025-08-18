const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },       // Total quantity added in this batch
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
    issuedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    firm: { type: mongoose.Schema.Types.ObjectId, ref: 'Firm' },
    createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Inventory', InventorySchema);
