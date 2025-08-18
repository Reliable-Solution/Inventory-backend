    // vendor.routes.js
const express = require('express');
const { createJobWorker, getAllJobWorkers, deleteJobWorker, updateJobWorker } = require('../controllers/jobworkerController');
const router = express.Router();

// 👇 API Endpoints
router.post('/create-jobworker', createJobWorker);  
router.get('/all-jobworkers',getAllJobWorkers)         // Create vendor
router.put('/update-jobworker', updateJobWorker);         // Update vendor
router.delete('/delete-jobworker', deleteJobWorker);      // Delete vendor

module.exports = router;
