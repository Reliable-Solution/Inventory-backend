const express = require('express');
const { createInventory, updateInventory, getInventoryById, getInventories, deleteInventory, assignInventory, assignToJobWorker, getAssignments } = require('../controllers/inventoryController');
const router = express.Router();

router.post('/add-inventory', createInventory)
// router.put('/update-inventory', updateInventory)
// router.get('/get-inventory', getInventoryById)
router.get('/all-inventory', getInventories);
router.delete('/delete-inventory', deleteInventory)
router.post('/assign-toJobworker', assignToJobWorker)
// router.post('/assign-inventory', assignInventory);
router.post('/get-assignments', getAssignments)

module.exports = router;
