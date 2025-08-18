// // controllers/inventoryController.js
// const InventoryLog = require("../model/inventory");
// const mongoose = require("mongoose");
// const Product = require("../model/product");
// const Vendor = require("../model/Vendor");
// const Jobworker = require("../model/jobworker");
// const Firm = require("../model/firm");
// const Employee = require("../model/employee");

// // 🛠 Create Inventory Log
// exports.createInventory = async (req, res) => {
//     try {
//         const {
//             product,
//             quantity,
//             action,      // 'add', 'assign', 'return', 'sale', 'transfer'
//             issuedBy,
//             // employee,    // optional
//             // jobworker,   // optional
//             vendor,      // optional
//             firm,        // optional
//             issueDetails // optional
//         } = req.body;

//         // Validate required fields
//         if (!product || !quantity || !action || !issuedBy) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'product, quantity, action, and issuedBy are required.'
//             });
//         }

//         // If assigning or returning, must specify either employee or jobworker
//         // if (['assign', 'return'].includes(action)) {
//         //     if (!employee && !jobworker) {
//         //         return res.status(400).json({
//         //             success: false,
//         //             message: 'For assign/return, employee or jobworker must be specified.'
//         //         });
//         //     }
//         // }

//         // ---- STOCK CONTROL: Only allow assign/sale/transfer if enough stock is available ----
//         if (['assign', 'sale', 'transfer'].includes(action)) {
//             // Calculate current available stock for this product
//             const logs = await InventoryLog.find({ product, status: 'Cleared' });
//             let totalAdd = 0, totalAssign = 0, totalReturn = 0, totalSale = 0, totalTransfer = 0;

//             logs.forEach(log => {
//                 if (log.action === 'add') totalAdd += log.quantity;
//                 if (log.action === 'assign') totalAssign += log.quantity;
//                 if (log.action === 'return') totalReturn += log.quantity;
//                 if (log.action === 'sale') totalSale += log.quantity;
//                 if (log.action === 'transfer') totalTransfer += log.quantity;
//             });

//             const available = (totalAdd + totalReturn) - (totalAssign + totalSale + totalTransfer);

//             if (available < quantity) {
//                 return res.status(400).json({
//                     success: false,
//                     message: `Not enough stock. Only ${available} available.`
//                 });
//             }
//         }
//         // -----------------------------------------------------------------------------

//         // Create log entry
//         const newLog = new InventoryLog({
//             product,
//             quantity,
//             action,
//             issuedBy,
//             // employee: employee || null,
//             // jobworker: jobworker || null,
//             vendor: vendor || null,
//             firm: firm || null,
//             issueDetails,
//             status: 'Pending' // (set to 'Cleared' if business process requires immediate clearing)
//         });

//         const savedLog = await newLog.save();

//         return res.status(201).json({
//             success: true,
//             message: 'Inventory log created successfully.',
//             data: savedLog
//         });

//     } catch (error) {
//         console.error('🔥 Error creating inventory log:', error.message);
//         res.status(500).json({
//             success: false,
//             message: 'Server error while creating inventory log.',
//             error: error.message
//         });
//     }
// }

// // 🛠 Update Inventory Log
// exports.updateInventory = async (req, res) => {
//     console.log("🔄 Received request to update inventory log...");

//     try {
//         const { id, ...updateData } = req.body;

//         // 🛑 Check if ID is provided
//         if (!id) {
//             console.error("❌ No ID provided in request");
//             return res.status(400).json({
//                 success: false,
//                 message: "Inventory log ID is required."
//             });
//         }

//         // ✏️ Attempt update
//         const updatedLog = await InventoryLog.findByIdAndUpdate(
//             id,
//             { $set: updateData },
//             { new: true, runValidators: true }
//         );

//         if (!updatedLog) {
//             console.warn(`⚠️ Inventory log not found for ID: ${id}`);
//             return res.status(404).json({
//                 success: false,
//                 message: "Inventory log not found."
//             });
//         }

//         console.log(`✅ Inventory log updated: ${updatedLog._id}`);

//         res.json({
//             success: true,
//             message: "Inventory log updated successfully.",
//             data: updatedLog
//         });

//     } catch (error) {
//         console.error("🔥 Error updating inventory log:", error);
//         res.status(500).json({
//             success: false,
//             message: "Server error while updating inventory log.",
//             error: error.message
//         });
//     }
// };

// // 🗑 Delete Inventory Log
// exports.deleteInventory = async (req, res) => {
//     console.log("🗑 Received request to delete inventory log...");

//     try {
//         const { id } = req.body;

//         // 🛑 Validate ID
//         if (!id) {
//             console.error("❌ No inventory log ID provided");
//             return res.status(400).json({
//                 success: false,
//                 message: "Inventory log ID is required."
//             });
//         }

//         // 🚮 Attempt delete
//         const deletedLog = await InventoryLog.findByIdAndDelete(id);

//         if (!deletedLog) {
//             console.warn(`⚠️ Inventory log not found for ID: ${id}`);
//             return res.status(404).json({
//                 success: false,
//                 message: "Inventory log not found."
//             });
//         }

//         console.log(`✅ Inventory log deleted successfully: ${deletedLog._id}`);

//         res.json({
//             success: true,
//             message: "Inventory log deleted successfully.",
//             deletedId: deletedLog._id
//         });

//     } catch (error) {
//         console.error(`🔥 Error deleting inventory log (ID: ${req.params.id}):`, error);
//         res.status(500).json({
//             success: false,
//             message: "Server error while deleting inventory log.",
//             error: error.message
//         });
//     }
// };

// exports.getInventories = async (req, res) => {
//     const startTime = Date.now();
//     console.log("📥 Fetching inventory logs...");

//     try {
//         // Filters
//         const filter = {};
//         if (req.query.firm) filter.firm = req.query.firm;
//         if (req.query.action) filter.action = req.query.action;

//         // Pagination
//         const page = parseInt(req.query.page) || 1;
//         const limit = parseInt(req.query.limit) || 20;
//         const skip = (page - 1) * limit;

//         // Field selection (optional: ?fields=product,quantity,action)
//         const selectFields = req.query.fields
//             ? req.query.fields.replace(/,/g, " ")
//             : "";

//         // Query
//         const inventories = await InventoryLog.find(filter)
//             .select(selectFields)
//             .populate("product", "name sku")
//             .populate("employee", "name email")
//             .populate("jobworker", "name phone")
//             .populate("vendor", "name")
//             .populate("firm", "name")
//             .sort({ createdAt: -1 })
//             .skip(skip)
//             .limit(limit);

//         const total = await InventoryLog.countDocuments(filter);

//         console.log(
//             `✅ Found ${inventories.length} logs | Page ${page} of ${Math.ceil(
//                 total / limit
//             )} | ⏱ ${Date.now() - startTime}ms`
//         );

//         res.json({
//             success: true,
//             message: "Inventory logs fetched successfully.",
//             count: inventories.length,
//             total,
//             page,
//             totalPages: Math.ceil(total / limit),
//             data: inventories
//         });

//     } catch (error) {
//         console.error(
//             `🔥 Error fetching inventory logs | Params: ${JSON.stringify(
//                 req.query
//             )} | Error: ${error.message}`
//         );
//         res.status(500).json({
//             success: false,
//             message: "Server error while fetching inventory logs.",
//             error: error.message
//         });
//     }
// };


// /**
//  * 👁️ View Single Inventory Log
//  */
// exports.getInventoryById = async (req, res) => {
//     try {
//         const { id } = req.body;

//         const inventory = await InventoryLog.findById(id)
//             .populate('product')
//             .populate('employee')
//             .populate('jobworker')
//             .populate('vendor')
//             .populate('firm');

//         if (!inventory) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Inventory log not found."
//             });
//         }

//         res.json({
//             success: true,
//             message: "Inventory log fetched successfully.",
//             data: inventory
//         });
//     } catch (error) {
//         console.error("🔥 Error fetching inventory log:", error.message);
//         res.status(500).json({
//             success: false,
//             message: "Server error while fetching inventory log.",
//             error: error.message
//         });
//     }
// };

// exports.assignToJobWorker = async (req, res) => {
//     try {
//         const { product, quantity, jobworker, issuedBy, firm } = req.body;
//         console.log("🔄 Assigning inventory to jobworker...", req.body);

//         if (!product || !quantity || !jobworker) {
//             return res.status(400).json({
//                 success: false,
//                 message: "product, quantity, and jobworker are required."
//             });
//         }

//         // 1. Get current stock
//         const logs = await InventoryLog.find({ product });

//         console.log(`📒 Found ${logs.length} cleared logs for product: ${product}`);

//         let totalAdd = 0, totalAssign = 0, totalReturn = 0, totalSale = 0;

//         logs.forEach(log => {
//             if (log.action === 'add') {
//                 totalAdd += log.quantity;
//                 console.log(`➕ Added: ${log.quantity} (Total Add = ${totalAdd})`);
//             }
//             if (log.action === 'assign') {
//                 totalAssign += log.quantity;
//                 console.log(`📦 Assigned: ${log.quantity} (Total Assign = ${totalAssign})`);
//             }
//             if (log.action === 'return') {
//                 totalReturn += log.quantity;
//                 console.log(`↩️ Returned: ${log.quantity} (Total Return = ${totalReturn})`);
//             }
//             if (log.action === 'sale') {
//                 totalSale += log.quantity;
//                 console.log(`💰 Sold: ${log.quantity} (Total Sale = ${totalSale})`);
//             }
//         });

//         // Final stock calculation
//         const currentStock = (totalAdd + totalReturn) - (totalAssign + totalSale);

//         console.log(`📊 Stock Calculation → (Add:${totalAdd} + Return:${totalReturn}) - (Assign:${totalAssign} + Sale:${totalSale}) = Current:${currentStock}`);

//         if (currentStock < quantity) {
//             console.warn(`⚠️ Stock shortage! Requested: ${quantity}, Available: ${currentStock}`);
//             return res.status(400).json({
//                 success: false,
//                 message: `Not enough stock available. Requested: ${quantity}, Available: ${currentStock}`
//             });
//         }

//         console.log(`✅ Stock check passed. Requested: ${quantity}, Available: ${currentStock}`);

//         // 2. Create a new inventory log for this assignment (DO NOT update previous records!)
//         const assignLog = new InventoryLog({
//             product,
//             quantity,
//             action: 'assign',
//             jobworker,
//             issuedBy,
//             firm,
//             status: 'Pending'
//         });
//         await assignLog.save();

//         res.status(201).json({
//             success: true,
//             message: "Inventory assigned to jobworker successfully.",
//             data: assignLog
//         });

//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: "Server error while assigning InventoryLog.",
//             error: error.message
//         });
//     }
// };


// controllers/inventoryController.js
const Inventory = require("../model/inventory");
const InventoryAssignment = require("../model/InventoryAssign");
// const Product = require("../model/Product");
// const Vendor = require("../model/Vendor");
// const Jobworker = require("../model/JobWorker");
// const Firm = require("../model/Firm");
// const Employee = require("../model/Employee");
// const User = require("../model/User");

// 🛠 Add Stock (Create Inventory Batch)
exports.createInventory = async (req, res) => {
    try {
        const { product, quantity, vendor, issuedBy, firm } = req.body;
        console.log("🔄 Creating new inventory batch...", req.body);

        if (!product || !quantity || !issuedBy) {
            return res.status(400).json({
                success: false,
                message: "product, quantity, and issuedBy are required."
            });
        }

        const newBatch = new Inventory({
            product,
            quantity,
            vendor,
            issuedBy,
            firm
        });

        await newBatch.save();
        console.log(`📦 Stock added → Product:${product}, Qty:${quantity}`);

        res.status(201).json({
            success: true,
            message: "Inventory batch created successfully.",
            data: newBatch
        });

    } catch (err) {
        console.error("🔥 Error creating inventory batch:", err.message);
        res.status(500).json({
            success: false,
            message: "Server error while creating inventory batch.",
            error: err.message
        });
    }
};

// 🛠 Assign Stock to Worker
exports.assignToJobWorker = async (req, res) => {
    try {
        const { inventory, quantity, jobworker, employee, assignedBy, issueDetails } = req.body;

        if (!inventory || !quantity || (!jobworker && !employee)) {
            return res.status(400).json({
                success: false,
                message: "inventory, quantity and either jobworker/employee are required."
            });
        }

        // ✅ Fetch inventory batch
        const batch = await Inventory.findById(inventory);
        if (!batch) {
            return res.status(404).json({ success: false, message: "Inventory batch not found." });
        }

        // ✅ Check stock
        if (batch.quantity < quantity) {
            return res.status(400).json({
                success: false,
                message: `Not enough stock in this batch. Available: ${batch.quantity}`
            });
        }

        // ✅ Reduce stock from batch
        batch.quantity -= quantity;
        await batch.save();

        // ✅ Create assignment record
        const assignment = new InventoryAssignment({
            InventoryId: inventory,
            quantity,
            jobworker: jobworker || null,
            // employee: employee || null,
            assignedBy,
            issueDetails,
            status: "Pending"
        });

        await assignment.save();

        console.log(`📤 Assigned ${quantity} from Batch:${inventory} → ${jobworker ? "Jobworker" : "Employee"} `);

        res.status(201).json({
            success: true,
            message: "Inventory assigned successfully.",
            data: assignment
        });

    } catch (err) {
        console.error("🔥 Error assigning inventory:", err.message);
        res.status(500).json({
            success: false,
            message: "Server error while assigning inventory.",
            error: err.message
        });
    }
};

// 📋 Get Inventory Batches
exports.getInventories = async (req, res) => {
    try {
        const inventories = await Inventory.find()
            .populate("product", "name sku")
            .populate("vendor", "name")
            .populate("issuedBy", "name email")
            .populate("firm", "name")
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: inventories.length,
            data: inventories
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error fetching inventories",
            error: err.message
        });
    }
};

// 📋 Get Assignments
// 📋 Get Assignments (optionally filter by inventoryId)
exports.getAssignments = async (req, res) => {
    try {
        const { inventoryId } = req.body;
        console.log("📋 Fetching assignments for inventory:", req.body);

        const assignments = await InventoryAssignment.find({ InventoryId: inventoryId })
            .populate("InventoryId", "product quantity")
            .populate("jobworker", "name phone")
            // .populate("employee", "name email")
            .populate("assignedBy", "name")
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: assignments.length,
            data: assignments
        });

    } catch (err) {
        console.log("🔥 Error fetching assignments:", err.message);
        res.status(500).json({
            success: false,
            message: "Error fetching assignments",
            error: err.message
        });
    }
};

exports.deleteInventory = async (req, res) => {
    console.log("🗑 Received request to delete inventory log...");

    try {
        const { id } = req.body;

        // 🛑 Validate ID
        if (!id) {
            console.error("❌ No inventory log ID provided");
            return res.status(400).json({
                success: false,
                message: "Inventory log ID is required."
            });
        }

        // 🚮 Attempt delete
        const deletedLog = await InventoryLog.findByIdAndDelete(id);

        if (!deletedLog) {
            console.warn(`⚠️ Inventory log not found for ID: ${id}`);
            return res.status(404).json({
                success: false,
                message: "Inventory log not found."
            });
        }

        console.log(`✅ Inventory log deleted successfully: ${deletedLog._id}`);

        res.json({
            success: true,
            message: "Inventory log deleted successfully.",
            deletedId: deletedLog._id
        });

    } catch (error) {
        console.error(`🔥 Error deleting inventory log (ID: ${req.params.id}):`, error);
        res.status(500).json({
            success: false,
            message: "Server error while deleting inventory log.",
            error: error.message
        });
    }
};

/**
 * 🛠 Update status of Inventory Assignment
 * PATCH /api/inventory/assignment/status
 * Body: { id, status }
 */
exports.updateAssignmentStatus = async (req, res) => {
    try {
        const { batchId, status } = req.body;

        if (!batchId || !status) {
            return res.status(400).json({
                success: false,
                message: "Assignment id and status are required."
            });
        }

        const updatedAssignment = await InventoryAssignment.findByIdAndUpdate(
            { _id: batchId },
            { $set: { status } },
            { new: true, runValidators: true }
        );

        if (!updatedAssignment) {
            return res.status(404).json({
                success: false,
                message: "Inventory assignment not found."
            });
        }

        res.json({
            success: true,
            message: "Assignment status updated successfully.",
            data: updatedAssignment
        });
    } catch (err) {
        console.error("🔥 Error updating assignment status:", err.message);
        res.status(500).json({
            success: false,
            message: "Server error while updating assignment status.",
            error: err.message
        });
    }
};