const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema({
    products: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, required: true },
            discount: { type: Number, default: 0 },
            price: { type: Number, required: true },
        }
    ],
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
    issuedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    firm: { type: mongoose.Schema.Types.ObjectId, ref: 'Firm' },
    notes: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Inventory', InventorySchema);
