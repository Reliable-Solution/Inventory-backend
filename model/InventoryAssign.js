const mongoose = require('mongoose');

const InventoryAssignmentSchema = new mongoose.Schema({
    InventoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Inventory', required: true }, // Reference to Inventory batch
    quantity: { type: Number, required: true },        // Quantity assigned in this transaction
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
    jobworker: { type: mongoose.Schema.Types.ObjectId, ref: 'JobWorker' },
    status: { type: String, enum: ['Pending', 'Cleared'], default: 'Pending' },
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // Who assigned
    issueDetails: String,
    createdAt: { type: Date, default: Date.now }
});

const InventoryAssignment = mongoose.model('InventoryAssignment', InventoryAssignmentSchema);
module.exports = InventoryAssignment;